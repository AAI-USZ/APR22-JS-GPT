'use strict'

const path = require('path')

const logger = require('./logger')
const log = logger.create('config')
const helper = require('./helper')
const constant = require('./constants')

const _ = require('lodash')

let COFFEE_SCRIPT_AVAILABLE = false
let LIVE_SCRIPT_AVAILABLE = false
let TYPE_SCRIPT_AVAILABLE = false



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

class Pattern {
constructor (pattern, served, included, watched, nocache, type) {
this.pattern = pattern
this.served = helper.isDefined(served) ? served : true
this.included = helper.isDefined(included) ? included : true
this.watched = helper.isDefined(watched) ? watched : true
this.nocache = helper.isDefined(nocache) ? nocache : false
this.weight = helper.mmPatternWeight(pattern)
this.type = type
}

compare (other) {
return helper.mmComparePatternWeights(this.weight, other.weight)
}
}

class UrlPattern extends Pattern {
constructor (url, type) {
super(url, false, true, false, false, type)
}
}

function createPatternObject (pattern) {
if (pattern && helper.isString(pattern)) {
return helper.isUrlAbsolute(pattern)
? new UrlPattern(pattern)
: new Pattern(pattern)
} else if (helper.isObject(pattern) && pattern.pattern && helper.isString(pattern.pattern)) {
return helper.isUrlAbsolute(pattern.pattern)
? new UrlPattern(pattern.pattern, pattern.type)
: new Pattern(pattern.pattern, pattern.served, pattern.included, pattern.watched, pattern.nocache, pattern.type)
} else {
log.warn(`Invalid pattern ${pattern}!\n\tExpected string or object with "pattern" property.`)
return new Pattern(null, false, false, false, false)
