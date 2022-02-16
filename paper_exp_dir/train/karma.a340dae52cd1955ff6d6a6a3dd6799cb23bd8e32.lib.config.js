var path = require('path')

var logger = require('./logger')
var log = logger.create('config')
var helper = require('./helper')
var constant = require('./constants')

var _ = require('lodash')

var COFFEE_SCRIPT_AVAILABLE = false
var LIVE_SCRIPT_AVAILABLE = false
var TYPE_SCRIPT_AVAILABLE = false



try {
require('coffee-script').register()
COFFEE_SCRIPT_AVAILABLE = true
} catch (e) {}



try {
require('LiveScript')
LIVE_SCRIPT_AVAILABLE = true
} catch (e) {}

try {
require('ts-node').register()
TYPE_SCRIPT_AVAILABLE = true
} catch (e) {}

