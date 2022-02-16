








require('core-js')
var from = require('core-js/library/fn/array/from')
var Promise = require('bluebird')
var mm = require('minimatch')
var Glob = require('glob').Glob
var fs = Promise.promisifyAll(require('graceful-fs'))
var pathLib = require('path')
var _ = require('lodash')

var File = require('./file')
var Url = require('./url')
var helper = require('./helper')
var log = require('./logger').create('watcher')
var createPatternObject = require('./config').createPatternObject




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




function emit () {
self._emitter.emit('file_list_modified', self.files)
}
var throttledEmit = _.throttle(emit, self._batchInterval, {leading: false})
self._emitModified = function (immediate) {
immediate ? emit() : throttledEmit()
}
}










List.prototype._isExcluded = function (path) {
return _.find(this._excludes, function (pattern) {
return mm(path, pattern)
})
}






List.prototype._isIncluded = function (path) {
return _.find(this._patterns, function (pattern) {
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

return !!_.find(patterns, function (pattern) {
return self._findFile(path, pattern)
})
}


List.prototype._isRefreshing = function () {
return this._refreshing.isPending()
}


List.prototype._refresh = function () {
var self = this
var buckets = this.buckets
var matchedFiles = new Set()

var promise = Promise.map(this._patterns, function (patternObject) {
var pattern = patternObject.pattern

if (helper.isUrlAbsolute(pattern)) {
buckets.set(pattern, new Set([new Url(pattern)]))
return Promise.resolve()
}

