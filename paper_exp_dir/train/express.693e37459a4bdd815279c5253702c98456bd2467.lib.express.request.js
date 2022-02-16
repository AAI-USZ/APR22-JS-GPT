




var StaticFile = require('express/static').File,
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
utils = require('express/utils'),
url = require('url')





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = Class({



init: function(request, response) {
