
'use strict'

const mime = require('mime')
const _ = require('lodash')
const parseRange = require('range-parser')
const Buffer = require('safe-buffer').Buffer

const log = require('../logger').create('web-server')

class PromiseContainer {
constructor () {
this.promise = null
}

then (success, error) {
return this.promise.then(success, error)
}

set (newPromise) {
this.promise = newPromise
}
}

function serve404 (response, path) {
log.warn('404: ' + path)
response.writeHead(404)
