

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
