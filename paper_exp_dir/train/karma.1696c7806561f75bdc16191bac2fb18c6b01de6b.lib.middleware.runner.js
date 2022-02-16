

var path = require('path')
var helper = require('../helper')
var log = require('../logger').create()
var constant = require('../constants')
var json = require('body-parser').json()


var createRunnerMiddleware = function (emitter, fileList, capturedBrowsers, reporter, executor,
protocol,   hostname,
port,   urlRoot, config) {
return function (request, response, next) {
if (request.url !== '/__run__' && request.url !== urlRoot + 'run') {
return next()
}

log.debug('Execution (fired by runner)')
response.writeHead(200)

