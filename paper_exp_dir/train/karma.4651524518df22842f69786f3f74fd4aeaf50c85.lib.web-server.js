'use strict'

const fs = require('graceful-fs')
const http = require('http')
const https = require('https')
const path = require('path')
const connect = require('connect')
const Promise = require('bluebird')

const common = require('./middleware/common')
const runnerMiddleware = require('./middleware/runner')
const stopperMiddleware = require('./middleware/stopper')
const karmaMiddleware = require('./middleware/karma')
const sourceFilesMiddleware = require('./middleware/source_files')
const proxyMiddleware = require('./middleware/proxy')

const log = require('./logger').create('web-server')

function createCustomHandler (customFileHandlers, config) {
return function (request, response, next) {
const handler = customFileHandlers.find((handler) => handler.urlRegex.test(request.url))
return handler
? handler.handler(request, response, 'fake/static', 'fake/adapter', config.basePath, 'fake/root')
: next()
}
}

createCustomHandler.$inject = ['customFileHandlers', 'config']

function createFilesPromise (emitter, fileList) {
const filesPromise = new common.PromiseContainer()



filesPromise.set(Promise.resolve(fileList.files))

emitter.on('file_list_modified', (files) => filesPromise.set(Promise.resolve(files)))

return filesPromise
}


function createReadFilePromise () {
return (filepath) => {
return new Promise((resolve, reject) => {
fs.readFile(filepath, 'utf8', function (error, data) {
if (error) {
reject(new Error(`Cannot read ${filepath}, got: ${error}`))
} else if (!data) {
reject(new Error(`No content at ${filepath}`))
} else {
