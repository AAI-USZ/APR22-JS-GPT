var fs = require('graceful-fs')
var crypto = require('crypto')
var mm = require('minimatch')
var isBinaryFile = require('isbinaryfile')
var combineLists = require('combine-lists')

var log = require('./logger').create('preprocess')

var sha1 = function (data) {
var hash = crypto.createHash('sha1')
hash.update(data)
return hash.digest('hex')
}

var createNextProcessor = function (preprocessors, file, done) {
return function nextPreprocessor (error, content) {

if (arguments.length === 1 && typeof error === 'string') {
content = error
error = null
}

if (error) {
file.content = null
file.contentPath = null
return done(error)
}

if (!preprocessors.length) {
file.contentPath = null
file.content = content
file.sha = sha1(content)
return done()
}

preprocessors.shift()(content, file, nextPreprocessor)
}
}

var createPreprocessor = function (config, basePath, injector) {
var alreadyDisplayedErrors = {}
var instances = {}
var patterns = Object.keys(config)

var emitter = injector.get('emitter')

var instantiatePreprocessor = function (name) {
if (alreadyDisplayedErrors[name]) {
return
}

var p

try {
p = injector.get('preprocessor:' + name)
} catch (e) {
if (e.message.indexOf('No provider for "preprocessor:' + name + '"') !== -1) {
log.error('Can not load "%s", it is not registered!\n  ' +
'Perhaps you are missing some plugin?', name)
} else {
log.error('Can not load "%s"!\n  ' + e.stack, name)
}
alreadyDisplayedErrors[name] = true
emitter.emit('load_error', 'preprocessor', name)
}

return p
}

var allPreprocessors = []
patterns.forEach(function (pattern) {
allPreprocessors = combineLists(allPreprocessors, config[pattern])
})
allPreprocessors.forEach(instantiatePreprocessor)

return function preprocess (file, done) {
patterns = Object.keys(config)
var retryCount = 0
var maxRetries = 3
function readFileCallback (err, buffer) {
if (err) {
log.warn(err)
if (retryCount < maxRetries) {
retryCount++
log.warn('retrying ' + retryCount)
fs.readFile(file.originalPath, readFileCallback)
return
