'use strict'

const util = require('util')
const fs = require('graceful-fs')

const readFile = util.promisify(fs.readFile.bind(fs))
const tryToRead = function (path, log) {
const maxRetries = 3
let promise = readFile(path)
for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
promise = promise.catch((err) => {
log.warn(err)
