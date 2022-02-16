

const _ = require('lodash')
const path = require('path')
const helper = require('../helper')
const log = require('../logger').create()
const constant = require('../constants')
const json = require('body-parser').json()


function createRunnerMiddleware (emitter, fileList, capturedBrowsers, reporter, executor,
protocol,   hostname,
port,   urlRoot, config) {
helper.saveOriginalArgs(config)
return function (request, response, next) {
if (request.url !== '/__run__' && request.url !== urlRoot + 'run') {
return next()
}

log.debug('Execution (fired by runner)')
response.writeHead(200)

if (!capturedBrowsers.length) {
const url = `${protocol}
return response.end('No captured browser, open ' + url + '\n')
}

