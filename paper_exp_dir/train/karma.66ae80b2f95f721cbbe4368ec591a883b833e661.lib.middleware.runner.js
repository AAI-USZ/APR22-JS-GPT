

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

if (!capturedBrowsers.length) {
var url = protocol + '//' + hostname + ':' + port + urlRoot

return response.end('No captured browser, open ' + url + '\n')
}

json(request, response, function () {
if (!capturedBrowsers.areAllReady([])) {
response.write('Waiting for previous execution...\n')
}

emitter.once('run_start', function () {
var responseWrite = response.write.bind(response)

reporter.addAdapter(responseWrite)


emitter.once('run_complete', function (browsers, results) {
reporter.removeAdapter(responseWrite)
var emptyTestSuite = (results.failed + results.success) === 0 ? 0 : 1
response.end(constant.EXIT_CODE + emptyTestSuite + results.exitCode)
})
})

var data = request.body
log.debug('Setting client.args to ', data.args)
config.client.args = data.args

var fullRefresh = true

if (helper.isArray(data.changedFiles)) {
data.changedFiles.forEach(function (filepath) {
fileList.changeFile(path.resolve(config.basePath, filepath))
fullRefresh = false
})
}

if (helper.isArray(data.addedFiles)) {
data.addedFiles.forEach(function (filepath) {
fileList.addFile(path.resolve(config.basePath, filepath))
fullRefresh = false
})
}

if (helper.isArray(data.removedFiles)) {
data.removedFiles.forEach(function (filepath) {
fileList.removeFile(path.resolve(config.basePath, filepath))
fullRefresh = false
})
}

if (fullRefresh && data.refresh !== false) {
log.debug('Refreshing all the files / patterns')
fileList.refresh().then(function () {


if (!config.autoWatch) {
executor.schedule()
}
})
} else {
executor.schedule()
}
})
}
}

createRunnerMiddleware.$inject = ['emitter', 'fileList', 'capturedBrowsers', 'reporter', 'executor',
'config.protocol', 'config.hostname', 'config.port', 'config.urlRoot', 'config']


exports.create = createRunnerMiddleware
