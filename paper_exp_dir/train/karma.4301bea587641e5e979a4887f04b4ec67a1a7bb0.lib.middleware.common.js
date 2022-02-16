

var mime = require('mime')
var log = require('../logger').create('web-server')

var PromiseContainer = function () {
var promise

this.then = function (success, error) {
return promise.then(success).catch(error)
}

this.set = function (newPromise) {
promise = newPromise
}
}

var serve404 = function (response, path) {
log.warn('404: ' + path)
response.writeHead(404)
return response.end('NOT FOUND')
}

var createServeFile = function (fs, directory, config) {
var cache = Object.create(null)

return function (filepath, response, transform, content, doNotCache) {
var responseData

if (directory) {
filepath = directory + filepath
}

if (!content && cache[filepath]) {
content = cache[filepath]
}

if (config && config.customHeaders && config.customHeaders.length > 0) {
config.customHeaders.forEach(function (header) {
var regex = new RegExp(header.match)
if (regex.test(filepath)) {
log.debug('setting header: ' + header.name + ' for: ' + filepath)
response.setHeader(header.name, header.value)
}
})
}
