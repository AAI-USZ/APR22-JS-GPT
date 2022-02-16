var from = require('core-js/library/fn/array/from')
var querystring = require('querystring')
var common = require('./common')
var _ = require('../helper')._
var logger = require('../logger')
var log = logger.create('middlware:source-files')


var findByPath = function (files, path) {
return _.find(from(files), function (file) {
return file.path === path
})
}


var createSourceFilesMiddleware = function (filesPromise, serveFile, basePath, urlRoot) {
return function (request, response, next) {
var requestedFilePath = querystring.unescape(request.url)
