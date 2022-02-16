








var Map = require('core-js/library/fn/map')
var Set = require('core-js/library/fn/set')
var from = require('core-js/library/fn/array/from')
var Promise = require('bluebird')
var mm = require('minimatch')
var Glob = require('glob').Glob
var fs = Promise.promisifyAll(require('graceful-fs'))
var pathLib = require('path')
var _ = require('lodash')

