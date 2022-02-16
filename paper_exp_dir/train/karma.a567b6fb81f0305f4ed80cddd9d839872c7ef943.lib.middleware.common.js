

var mime = require('mime')
var _ = require('lodash')

var log = require('../logger').create('web-server')

var PromiseContainer = function () {
var promise

this.then = function (success, error) {
error = error || _.noop
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

return function (filepath, rangeHeader, response, transform, content, doNotCache) {
var responseData

var convertForRangeRequest = function () {

if (!rangeHeader.startsWith('bytes=')) {
return 200
}

responseData = new Buffer(responseData)

var ranges = rangeHeader.substr(6)
if (ranges.indexOf(',') >= 0) {
