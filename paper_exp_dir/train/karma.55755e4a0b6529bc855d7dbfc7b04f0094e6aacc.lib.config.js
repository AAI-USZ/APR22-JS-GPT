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

var Pattern = function (pattern, served, included, watched, nocache) {
this.pattern = pattern
this.served = helper.isDefined(served) ? served : true
this.included = helper.isDefined(included) ? included : true
this.watched = helper.isDefined(watched) ? watched : true
this.nocache = helper.isDefined(nocache) ? nocache : false
this.weight = helper.mmPatternWeight(pattern)
}

Pattern.prototype.compare = function (other) {
return helper.mmComparePatternWeights(this.weight, other.weight)
}

var UrlPattern = function (url) {
Pattern.call(this, url, false, true, false, false)
}

var createPatternObject = function (pattern) {
if (pattern && helper.isString(pattern)) {
return helper.isUrlAbsolute(pattern) ? new UrlPattern(pattern) : new Pattern(pattern)
}

if (helper.isObject(pattern)) {
if (pattern.pattern && helper.isString(pattern.pattern)) {
return helper.isUrlAbsolute(pattern.pattern)
? new UrlPattern(pattern.pattern)
: new Pattern(
pattern.pattern,
pattern.served,
pattern.included,
pattern.watched,
pattern.nocache)
}

log.warn('Invalid pattern %s!\n\tObject is missing "pattern" property.', pattern)
return new Pattern(null, false, false, false, false)
}

log.warn('Invalid pattern %s!\n\tExpected string or object with "pattern" property.', pattern)
return new Pattern(null, false, false, false, false)
}

var normalizeUrl = function (url) {
if (url.charAt(0) !== '/') {
url = '/' + url
}

if (url.charAt(url.length - 1) !== '/') {
url = url + '/'
}

return url
