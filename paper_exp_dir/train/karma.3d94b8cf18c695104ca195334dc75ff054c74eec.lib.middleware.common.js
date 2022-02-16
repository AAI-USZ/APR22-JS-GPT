

var mime = require('mime')
var _ = require('lodash')
var parseRange = require('range-parser')
var Buffer = require('safe-buffer').Buffer

var log = require('../logger').create('web-server')

var PromiseContainer = function () {
var promise

this.then = function (success, error) {
error = error || _.noop
return promise.then(success).catch(error)
