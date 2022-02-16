var from = require('core-js/library/fn/array/from')
var querystring = require('querystring')
var common = require('./common')
var _ = require('../helper')._
var logger = require('../logger')
var log = logger.create('middleware:source-files')


var findByPath = function (files, path) {
return _.find(from(files), function (file) {
return file.path === path
})
}


var createSourceFilesMiddleware = function (filesPromise, serveFile, basePath, urlRoot) {
return function (request, response, next) {
var requestedFilePath = querystring.unescape(request.url)
.replace(urlRoot, '/')
.replace(/\?.*$/, '')
.replace(/^\/absolute/, '')
.replace(/^\/base/, basePath)

request.pause()

log.debug('Requesting %s', request.url, urlRoot)
log.debug('Fetching %s', requestedFilePath)

return filesPromise.then(function (files) {

var file = findByPath(files.served, requestedFilePath)

if (file) {
serveFile(file.contentPath || file.path, response, function () {
if (/\?\w+/.test(request.url)) {

common.setHeavyCacheHeaders(response)
} else {

common.setNoCacheHeaders(response)
}
}, file.content, file.doNotCache)
} else {
next()
}

request.resume()
})
}
}

createSourceFilesMiddleware.$inject = [
'filesPromise', 'serveFile', 'config.basePath', 'config.urlRoot'
]


exports.create = createSourceFilesMiddleware
