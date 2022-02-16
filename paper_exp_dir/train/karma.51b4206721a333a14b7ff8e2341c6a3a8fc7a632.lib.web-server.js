var fs = require('graceful-fs')
var http = require('http')
var https = require('https')
var path = require('path')
var connect = require('connect')
var Promise = require('bluebird')

var common = require('./middleware/common')
var runnerMiddleware = require('./middleware/runner')
var stopperMiddleware = require('./middleware/stopper')
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
common.initializeMimeTypes(config)
var serveStaticFile = common.createServeFile(fs, path.normalize(path.join(__dirname, '/../static')), config)
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

log.debug('Instantiating middleware')
var handler = connect()

if (config.beforeMiddleware) {
config.beforeMiddleware.forEach(function (middleware) {
handler.use(injector.get('middleware:' + middleware))
})
}

handler.use(injector.invoke(runnerMiddleware.create))
handler.use(injector.invoke(stopperMiddleware.create))
handler.use(injector.invoke(stripHostMiddleware.create))
