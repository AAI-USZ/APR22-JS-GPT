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
