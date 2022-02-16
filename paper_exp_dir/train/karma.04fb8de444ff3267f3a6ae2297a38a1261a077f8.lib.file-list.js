








require('core-js')
var from = require('core-js/library/fn/array/from')
var Promise = require('bluebird')
var mm = require('minimatch')
var Glob = require('glob').Glob
var fs = Promise.promisifyAll(require('fs'))
var pathLib = require('path')

var File = require('./file')
var Url = require('./url')
var helper = require('./helper')
var _ = helper._
var log = require('./logger').create('watcher')




var GLOB_OPTS = {
cwd: '/',
follow: true,
nodir: true,
sync: true
}




function byPath (a, b) {
if (a.path > b.path) return 1
if (a.path < b.path) return -1

return 0
}








var List = function (patterns, excludes, emitter, preprocess, batchInterval) {


this._patterns = patterns
this._excludes = excludes
this._emitter = emitter
this._preprocess = Promise.promisify(preprocess)
this._batchInterval = batchInterval


this.buckets = new Map()







this._refreshing = Promise.resolve()

var self = this




this._emitModified = _.throttle(function () {
self._emitter.emit('file_list_modified', self.files)
}, this._batchInterval)
}










List.prototype._isExcluded = function (path) {
return _.find(this._excludes, function (pattern) {
return mm(path, pattern)
})
}






List.prototype._isIncluded = function (path) {
return this._patterns.find(function (pattern) {
return mm(path, pattern.pattern)
})
}








List.prototype._findFile = function (path, pattern) {

if (!path || !pattern) return
if (!this.buckets.has(pattern.pattern)) return

return _.find(from(this.buckets.get(pattern.pattern)), function (file) {
return file.originalPath === path
})
}






List.prototype._exists = function (path) {
var self = this

var patterns = this._patterns.filter(function (pattern) {
return mm(path, pattern.pattern)
})

return !!patterns.find(function (pattern) {
return self._findFile(path, pattern)
})
}


List.prototype._isRefreshing = function () {
return this._refreshing.isPending()
}


List.prototype._refresh = function () {
var self = this
var buckets = this.buckets

return Promise.all(this._patterns.map(function (patternObject) {
var pattern = patternObject.pattern

if (helper.isUrlAbsolute(pattern)) {
buckets.set(pattern, new Set([new Url(pattern)]))
return Promise.resolve()
}

var mg = new Glob(pathLib.normalize(pattern), GLOB_OPTS)
var files = mg.found
buckets.set(pattern, new Set())

if (_.isEmpty(files)) {
log.warn('Pattern "%s" does not match any file.', pattern)
return
}

return Promise.all(files.map(function (path) {
if (self._isExcluded(path)) {
log.debug('Excluded file "%s"', path)
return Promise.resolve()
}

var mtime = mg.statCache[path].mtime
var doNotCache = patternObject.nocache
var file = new File(path, mtime, doNotCache)

if (file.doNotCache) {
log.debug('Not preprocessing "%s" due to nocache')
return Promise.resolve(file)
}

return self._preprocess(file).then(function () {
return file
})
}))
.then(function (files) {
files = _.compact(files)

if (_.isEmpty(files)) {
log.warn('All files matched by "%s" were excluded.', pattern)
} else {
buckets.set(pattern, new Set(files))
}
})
}))
.cancellable()
.then(function () {
self.buckets = buckets
self._emitModified()
return self.files
})
.catch(Promise.CancellationError, function () {

return self._refreshing
})
}




Object.defineProperty(List.prototype, 'files', {
get: function () {
var self = this

var served = this._patterns.filter(function (pattern) {
return pattern.served
})
.map(function (p) {
return from(self.buckets.get(p.pattern)).sort(byPath)
})

var included = this._patterns.filter(function (pattern) {
return pattern.included
})
.map(function (p) {
return from(self.buckets.get(p.pattern)).sort(byPath)
})

var uniqFlat = function (list) {
return _.uniq(_.flatten(list), 'path')
}

return {
served: uniqFlat(served),
included: uniqFlat(included)
}
}
})





List.prototype.refresh = function () {
if (this._isRefreshing()) {
this._refreshing.cancel()
}

this._refreshing = this._refresh()
return this._refreshing
}









List.prototype.reload = function (patterns, excludes) {
this._patterns = patterns
this._excludes = excludes



return this.refresh()
}








List.prototype.addFile = function (path) {
var self = this


var excluded = this._isExcluded(path)
if (excluded) {
log.debug('Add file "%s" ignored. Excluded by "%s".', path, excluded)

return Promise.resolve(this.files)
}

var pattern = this._isIncluded(path)

if (!pattern) {
log.debug('Add file "%s" ignored. Does not match any pattern.', path)
return Promise.resolve(this.files)
}

if (this._exists(path)) {
log.debug('Add file "%s" ignored. Already in the list.', path)
return Promise.resolve(this.files)
}

var file = new File(path)
this.buckets.get(pattern.pattern).add(file)

return Promise.all([
fs.statAsync(path),
this._refreshing
]).spread(function (stat) {

file.mtime = stat.mtime
return self._preprocess(file)
})
.then(function () {
log.info('Added file "%s".', path)
self._emitModified()
return self.files
})
}








List.prototype.changeFile = function (path) {
var self = this

var pattern = this._isIncluded(path)
var file = this._findFile(path, pattern)

if (!pattern || !file) {
log.debug('Changed file "%s" ignored. Does not match any file in the list.', path)
return Promise.resolve(this.files)
}

return Promise.all([
fs.statAsync(path),
this._refreshing
]).spread(function (stat) {
if (stat.mtime <= file.mtime) throw new Promise.CancellationError()

file.mtime = stat.mtime
return self._preprocess(file)
})
.then(function () {
log.info('Changed file "%s".', path)
self._emitModified()
return self.files
})
.catch(Promise.CancellationError, function () {
return self.files
})
}








List.prototype.removeFile = function (path) {
var self = this

return Promise.try(function () {
var pattern = self._isIncluded(path)
var file = self._findFile(path, pattern)

if (!pattern || !file) {
log.debug('Removed file "%s" ignored. Does not match any file in the list.', path)
return self.files
}

self.buckets.get(pattern.pattern).delete(file)

log.info('Removed file "%s".', path)
self._emitModified()
return self.files
})
}


List.$inject = ['config.files', 'config.exclude', 'emitter', 'preprocess',
'config.autoWatchBatchDelay']


module.exports = List
