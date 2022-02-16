'use strict'




const Promise = require('bluebird')
const mm = require('minimatch')
const Glob = require('glob').Glob
const fs = Promise.promisifyAll(require('graceful-fs'))
const pathLib = require('path')
const _ = require('lodash')

const File = require('./file')
const Url = require('./url')
const helper = require('./helper')
const log = require('./logger').create('watcher')
const createPatternObject = require('./config').createPatternObject




const GLOB_OPTS = {
cwd: '/',
follow: true,
nodir: true,
sync: true
}




const byPath = (a, b) => {
if (a.path > b.path) return 1
if (a.path < b.path) return -1

return 0
}


class FileList {

constructor (patterns, excludes, emitter, preprocess, autoWatchBatchDelay) {

this._patterns = patterns
this._excludes = excludes
this._emitter = emitter
this._preprocess = Promise.promisify(preprocess)
this._autoWatchBatchDelay = autoWatchBatchDelay


this.buckets = new Map()







this._refreshing = Promise.resolve()




const emit = () => {
this._emitter.emit('file_list_modified', this.files)
}

const debouncedEmit = _.debounce(emit, this._autoWatchBatchDelay)
this._emitModified = (immediate) => {
immediate ? emit() : debouncedEmit()
}
}










_isExcluded (path) {
return _.find(this._excludes, (pattern) => mm(path, pattern))
}






_isIncluded (path) {
return _.find(this._patterns, (pattern) => mm(path, pattern.pattern))
}








_findFile (path, pattern) {
if (!path || !pattern) return
if (!this.buckets.has(pattern.pattern)) return

return _.find(Array.from(this.buckets.get(pattern.pattern)), (file) => {
return file.originalPath === path
})
}






_exists (path) {
const patterns = this._patterns.filter((pattern) => mm(path, pattern.pattern))

return !!_.find(patterns, (pattern) => this._findFile(path, pattern))
}


_isRefreshing () {
return this._refreshing.isPending()
}


_refresh () {
const buckets = this.buckets
const matchedFiles = new Set()

let promise
promise = Promise.map(this._patterns, (patternObject) => {
const pattern = patternObject.pattern
const type = patternObject.type

if (helper.isUrlAbsolute(pattern)) {
buckets.set(pattern, new Set([new Url(pattern, type)]))
return Promise.resolve()
}

const mg = new Glob(pathLib.normalize(pattern), GLOB_OPTS)
const files = mg.found
buckets.set(pattern, new Set())

if (_.isEmpty(files)) {
log.warn('Pattern "%s" does not match any file.', pattern)
return
}

return Promise.map(files, (path) => {
if (this._isExcluded(path)) {
log.debug('Excluded file "%s"', path)
return Promise.resolve()
}

if (matchedFiles.has(path)) {
return Promise.resolve()
}

matchedFiles.add(path)

const mtime = mg.statCache[path].mtime
const doNotCache = patternObject.nocache
const type = patternObject.type
const file = new File(path, mtime, doNotCache, type)

if (file.doNotCache) {
log.debug('Not preprocessing "%s" due to nocache', pattern)
return Promise.resolve(file)
}

return this._preprocess(file).then(() => {
return file
})
})
.then((files) => {
files = _.compact(files)

if (_.isEmpty(files)) {
log.warn('All files matched by "%s" were excluded or matched by prior matchers.', pattern)
} else {
buckets.set(pattern, new Set(files))
}
})
})
.then(() => {
if (this._refreshing !== promise) {
return this._refreshing
}
this.buckets = buckets
this._emitModified(true)
return this.files
})

return promise
}




get files () {
const uniqueFlat = (list) => {
return _.uniq(_.flatten(list), 'path')
}

const expandPattern = (p) => {
return Array.from(this.buckets.get(p.pattern) || []).sort(byPath)
}

const served = this._patterns.filter((pattern) => {
return pattern.served
})
.map(expandPattern)

const lookup = {}
const included = {}
this._patterns.forEach((p) => {



if (p.constructor.name !== 'Pattern') {
p = createPatternObject(p)
}

const bucket = expandPattern(p)
bucket.forEach((file) => {
const other = lookup[file.path]
if (other && other.compare(p) < 0) return
lookup[file.path] = p
if (p.included) {
included[file.path] = file
} else {
delete included[file.path]
}
})
})

return {
served: uniqueFlat(served),
included: _.values(included)
}
}





refresh () {
this._refreshing = this._refresh()
return this._refreshing
}









reload (patterns, excludes) {
this._patterns = patterns
this._excludes = excludes



return this.refresh()
}








addFile (path) {

const excluded = this._isExcluded(path)
if (excluded) {
log.debug('Add file "%s" ignored. Excluded by "%s".', path, excluded)

return Promise.resolve(this.files)
}

const pattern = this._isIncluded(path)

if (!pattern) {
log.debug('Add file "%s" ignored. Does not match any pattern.', path)
return Promise.resolve(this.files)
}

if (this._exists(path)) {
log.debug('Add file "%s" ignored. Already in the list.', path)
return Promise.resolve(this.files)
}

const file = new File(path)
this.buckets.get(pattern.pattern).add(file)

return Promise.all([
fs.statAsync(path),
this._refreshing
]).spread((stat) => {
file.mtime = stat.mtime
return this._preprocess(file)
})
.then(() => {
log.info('Added file "%s".', path)
this._emitModified()
return this.files
})
}








changeFile (path) {
const pattern = this._isIncluded(path)
const file = this._findFile(path, pattern)

if (!pattern || !file) {
log.debug('Changed file "%s" ignored. Does not match any file in the list.', path)
return Promise.resolve(this.files)
}

return Promise.all([
fs.statAsync(path),
this._refreshing
]).spread((stat) => {
if (stat.mtime <= file.mtime) throw new Promise.CancellationError()

file.mtime = stat.mtime
return this._preprocess(file)
})
.then(() => {
log.info('Changed file "%s".', path)
this._emitModified()
return this.files
})
.catch(Promise.CancellationError, () => {
return this.files
})
}








removeFile (path) {
return Promise.try(() => {
const pattern = this._isIncluded(path)
const file = this._findFile(path, pattern)

if (!pattern || !file) {
log.debug('Removed file "%s" ignored. Does not match any file in the list.', path)
return this.files
}

this.buckets.get(pattern.pattern).delete(file)

log.info('Removed file "%s".', path)
this._emitModified()
return this.files
})
}
}

FileList.factory = function (patterns, excludes, emitter, preprocess, autoWatchBatchDelay) {
return new FileList(patterns, excludes, emitter, preprocess, autoWatchBatchDelay)
}

FileList.factory.$inject = ['config.files', 'config.exclude', 'emitter', 'preprocess',
'config.autoWatchBatchDelay']

module.exports = FileList
