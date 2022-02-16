








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
