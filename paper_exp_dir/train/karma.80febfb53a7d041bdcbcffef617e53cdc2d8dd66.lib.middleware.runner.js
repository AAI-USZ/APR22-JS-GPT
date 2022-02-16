

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
return response.end(`No captured browser, open ${url}\n`)
}

json(request, response, function () {
if (!capturedBrowsers.areAllReady([])) {
response.write('Waiting for previous execution...\n')
}

const data = request.body

updateClientArgs(data)
handleRun(data)
refreshFileList(data).then(() => {
executor.schedule()
}).catch((error) => {
const errorMessage = `Error during refresh file list. ${error.stack || error}`
executor.scheduleError(errorMessage)
})
})
