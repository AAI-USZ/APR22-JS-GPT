var fs = require('fs')
var http = require('http')
var https = require('https')
var path = require('path')
var connect = require('connect')
var Promise = require('bluebird')

var common = require('./middleware/common')
var runnerMiddleware = require('./middleware/runner')
var stripHostMiddleware = require('./middleware/strip_host')
var karmaMiddleware = require('./middleware/karma')
var sourceFilesMiddleware = require('./middleware/source_files')
var proxyMiddleware = require('./middleware/proxy')

var log = require('./logger').create('web-server')

var createCustomHandler = function (customFileHandlers,   basePath) {
return function (request, response, next) {
for (var i = 0; i < customFileHandlers.length; i++) {
if (customFileHandlers[i].urlRegex.test(request.url)) {
return customFileHandlers[i].handler(request, response, 'fake/static', 'fake/adapter',
basePath, 'fake/root')
}
}

return next()
}
}

createCustomHandler.$inject = ['customFileHandlers', 'config.basePath']

var createWebServer = function (injector, emitter, fileList) {
var config = injector.get('config')
var serveStaticFile = common.createServeFile(fs, path.normalize(__dirname + '/../static'), config)
var serveFile = common.createServeFile(fs, null, config)
var filesPromise = new common.PromiseContainer()



filesPromise.set(Promise.resolve(fileList.files))

emitter.on('file_list_modified', function (files) {
filesPromise.set(Promise.resolve(files))
})



injector = injector.createChild([{
serveFile: ['value', serveFile],
serveStaticFile: ['value', serveStaticFile],
filesPromise: ['value', filesPromise]
}])

var proxyMiddlewareInstance = injector.invoke(proxyMiddleware.create)

var handler = connect()
.use(injector.invoke(runnerMiddleware.create))
.use(injector.invoke(stripHostMiddleware.create))
.use(injector.invoke(karmaMiddleware.create))
.use(injector.invoke(sourceFilesMiddleware.create))

.use(proxyMiddlewareInstance)


.use(injector.invoke(createCustomHandler))
.use(function (request, response) {
common.serve404(response, request.url)
})

var serverClass = http
var serverArguments = [handler]

if (config.protocol === 'https:') {
serverClass = https
serverArguments.unshift(config.httpsServerOptions || {})
}
var server = serverClass.createServer.apply(null, serverArguments)

server.on('upgrade', function (req, socket, head) {
log.debug('upgrade %s', req.url)
proxyMiddlewareInstance.upgrade(req, socket, head)
})

return server
}


exports.create = createWebServer
