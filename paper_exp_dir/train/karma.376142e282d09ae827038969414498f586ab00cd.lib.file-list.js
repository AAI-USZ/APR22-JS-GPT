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

class FileList {
constructor (patterns, excludes, emitter, preprocess, autoWatchBatchDelay) {
this._patterns = patterns || []
this._excludes = excludes || []
this._emitter = emitter
this._preprocess = Promise.promisify(preprocess)

this.buckets = new Map()


this._refreshing = null

const emit = () => {
this._emitter.emit('file_list_modified', this.files)
}

const debouncedEmit = _.debounce(emit, autoWatchBatchDelay)
this._emitModified = (immediate) => {
immediate ? emit() : debouncedEmit()
}
}

_findExcluded (path) {
return this._excludes.find((pattern) => mm(path, pattern))
}

_findIncluded (path) {
return this._patterns.find((pattern) => mm(path, pattern.pattern))
}

_findFile (path, pattern) {
if (!path || !pattern) return
return this._getFilesByPattern(pattern.pattern).find((file) => file.originalPath === path)
}

_exists (path) {
return !!this._patterns.find((pattern) => mm(path, pattern.pattern) && this._findFile(path, pattern))
}

_getFilesByPattern (pattern) {
return this.buckets.get(pattern) || []
}

_refresh () {
const matchedFiles = new Set()

let lastCompletedRefresh = this._refreshing
lastCompletedRefresh = Promise
.map(this._patterns, async ({ pattern, type, nocache }) => {
if (helper.isUrlAbsolute(pattern)) {
this.buckets.set(pattern, [new Url(pattern, type)])
return
}

const mg = new Glob(pathLib.normalize(pattern), { cwd: '/', follow: true, nodir: true, sync: true })

const files = mg.found
.filter((path) => {
if (this._findExcluded(path)) {
log.debug(`Excluded file "${path}"`)
return false
} else if (matchedFiles.has(path)) {
return false
} else {
