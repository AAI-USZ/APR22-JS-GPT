








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

