var path = require('path')
var fs = require('graceful-fs')
var crypto = require('crypto')
var mm = require('minimatch')
var extensions = require('./binary-extensions.json').extensions

var log = require('./logger').create('preprocess')

var sha1 = function (data) {
var hash = crypto.createHash('sha1')
hash.update(data)
return hash.digest('hex')
}

var isBinary = Object.create(null)
extensions.forEach(function (extension) {
isBinary['.' + extension] = true
})

var createPreprocessor = function (config, basePath, injector) {
var alreadyDisplayedWarnings = {}
var instances = {}
var patterns = Object.keys(config)

var instantiatePreprocessor = function (name) {
if (alreadyDisplayedWarnings[name]) {
return
}

try {
instances[name] = injector.get('preprocessor:' + name)
} catch (e) {
if (e.message.indexOf('No provider for "preprocessor:' + name + '"') !== -1) {
log.warn('Can not load "%s", it is not registered!\n  ' +
'Perhaps you are missing some plugin?', name)
} else {
log.warn('Can not load "%s"!\n  ' + e.stack, name)
}

alreadyDisplayedWarnings[name] = true
}
}

patterns.forEach(function (pattern) {
config[pattern].forEach(instantiatePreprocessor)
})

return function preprocess (file, done) {
patterns = Object.keys(config)
var thisFileIsBinary = isBinary[path.extname(file.originalPath).toLowerCase()]
var preprocessors = []
