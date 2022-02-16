var from = require('core-js/library/fn/array/from')
var querystring = require('querystring')
var _ = require('lodash')

var common = require('./common')
var logger = require('../logger')
var log = logger.create('middleware:source-files')


var findByPath = function (files, path) {
return _.find(from(files), function (file) {
return file.path === path
})
}

var composeUrl = function (url, basePath, urlRoot, mustEscape) {
return (mustEscape ? querystring.unescape(url) : url)
.replace(urlRoot, '/')
.replace(/\?.*$/, '')
.replace(/^\/absolute/, '')
.replace(/^\/base/, basePath)
}


var createSourceFilesMiddleware = function (filesPromise, serveFile, basePath, urlRoot) {
return function (request, response, next) {
var requestedFilePath = composeUrl(request.url, basePath, urlRoot, true)

var requestedFilePathUnescaped = composeUrl(request.url, basePath, urlRoot, false)

request.pause()

log.debug('Requesting %s', request.url, urlRoot)
log.debug('Fetching %s', requestedFilePath)

return filesPromise.then(function (files) {

var file = findByPath(files.served, requestedFilePath) ||
findByPath(files.served, requestedFilePathUnescaped)
var rangeHeader = request.headers['range']

if (file) {
serveFile(file.contentPath || file.path, rangeHeader, response, function () {
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
