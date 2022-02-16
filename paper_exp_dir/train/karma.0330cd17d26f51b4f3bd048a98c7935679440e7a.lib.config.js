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
require('coffeescript').register()
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

var Pattern = function (pattern, served, included, watched, nocache, type) {
this.pattern = pattern
this.served = helper.isDefined(served) ? served : true
this.included = helper.isDefined(included) ? included : true
this.watched = helper.isDefined(watched) ? watched : true
this.nocache = helper.isDefined(nocache) ? nocache : false
this.weight = helper.mmPatternWeight(pattern)
this.type = type
}

Pattern.prototype.compare = function (other) {
return helper.mmComparePatternWeights(this.weight, other.weight)
}

var UrlPattern = function (url) {
Pattern.call(this, url, false, true, false, false)
