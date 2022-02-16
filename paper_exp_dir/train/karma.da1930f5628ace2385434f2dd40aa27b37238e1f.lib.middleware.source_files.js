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
