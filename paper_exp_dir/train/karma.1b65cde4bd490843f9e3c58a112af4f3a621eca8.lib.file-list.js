








require('core-js')
var from = require('core-js/library/fn/array/from')
var Promise = require('bluebird')
var mm = require('minimatch')
var Glob = require('glob').Glob
var fs = Promise.promisifyAll(require('fs'))

var File = require('./file')
var Url = require('./url')
var helper = require('./helper')
var _ = helper._
var log = require('./logger').create('watcher')




var GLOB_OPTS = {
