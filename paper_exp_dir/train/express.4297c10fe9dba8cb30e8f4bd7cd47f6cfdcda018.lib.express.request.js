




var showExceptions = require('express/pages/show-exceptions'),
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
url = require('url')





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



