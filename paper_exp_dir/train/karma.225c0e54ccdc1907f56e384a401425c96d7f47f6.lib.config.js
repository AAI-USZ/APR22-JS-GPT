var path = require('path')

var logger = require('./logger')
var log = logger.create('config')
var helper = require('./helper')
var constant = require('./constants')

var COFFEE_SCRIPT_AVAILABLE = false
var LIVE_SCRIPT_AVAILABLE = false



try {
require('coffee-script').register()
COFFEE_SCRIPT_AVAILABLE = true
} catch (e) {}



try {
require('LiveScript')
LIVE_SCRIPT_AVAILABLE = true
} catch (e) {}

var Pattern = function (pattern, served, included, watched, nocache) {
this.pattern = pattern
this.served = helper.isDefined(served) ? served : true
this.included = helper.isDefined(included) ? included : true
this.watched = helper.isDefined(watched) ? watched : true
this.nocache = helper.isDefined(nocache) ? nocache : false
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

var normalizeUrlRoot = function (urlRoot) {
var normalizedUrlRoot = urlRoot

if (normalizedUrlRoot.charAt(0) !== '/') {
normalizedUrlRoot = '/' + normalizedUrlRoot
}

if (normalizedUrlRoot.charAt(normalizedUrlRoot.length - 1) !== '/') {
normalizedUrlRoot = normalizedUrlRoot + '/'
}

if (normalizedUrlRoot !== urlRoot) {
log.warn('urlRoot normalized to "%s"', normalizedUrlRoot)
}

return normalizedUrlRoot
}

var normalizeConfig = function (config, configFilePath) {
var basePathResolve = function (relativePath) {
if (helper.isUrlAbsolute(relativePath)) {
return relativePath
}

if (!helper.isDefined(config.basePath) || !helper.isDefined(relativePath)) {
return ''
}
return path.resolve(config.basePath, relativePath)
}

var createPatternMapper = function (resolve) {
return function (objectPattern) {
objectPattern.pattern = resolve(objectPattern.pattern)

return objectPattern
}
}

if (helper.isString(configFilePath)) {

config.basePath = path.resolve(path.dirname(configFilePath), config.basePath)


config.exclude.push(configFilePath)
} else {
config.basePath = path.resolve(config.basePath || '.')
}

config.files = config.files.map(createPatternObject).map(createPatternMapper(basePathResolve))
config.exclude = config.exclude.map(basePathResolve)
config.customContextFile = config.customContextFile && basePathResolve(config.customContextFile)
config.customDebugFile = config.customDebugFile && basePathResolve(config.customDebugFile)


config.basePath = helper.normalizeWinPath(config.basePath)
config.files = config.files.map(createPatternMapper(helper.normalizeWinPath))
config.exclude = config.exclude.map(helper.normalizeWinPath)
config.customContextFile = helper.normalizeWinPath(config.customContextFile)
config.customDebugFile = helper.normalizeWinPath(config.customDebugFile)


