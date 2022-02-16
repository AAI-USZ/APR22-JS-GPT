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
