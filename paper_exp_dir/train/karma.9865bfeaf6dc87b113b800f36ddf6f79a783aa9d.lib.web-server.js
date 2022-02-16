var fs = require('fs');
var http = require('http');
var path = require('path');
var util = require('util');
var querystring = require('querystring');
var httpProxy = require('http-proxy');
var pause = require('pause');
var mime = require('mime');

var helper = require('./helper');
var proxy = require('./proxy');
var log = require('./logger').create('web server');

var SCRIPT_TAG = '<script type="text/javascript" src="%s"></script>';


var setNoCacheHeaders = function(response) {
response.setHeader('Cache-Control', 'no-cache');
response.setHeader('Pragma', 'no-cache');
response.setHeader('Expires', (new Date(0)).toString());
};


var serveStaticFile = function(file, response, process) {
fs.readFile(file, function(error, data) {
if (error) {
log.warn('404: ' + file);
response.writeHead(404);
return response.end('NOT FOUND');
}


response.setHeader('Content-Type', mime.lookup(file, 'text/plain'));


var responseData = process && process(data.toString(), response) || data;
response.writeHead(200);

log.debug('serving: ' + file);
return response.end(responseData);
});
};


var createTestacularSourceHandler = function(promiseContainer, staticFolder, adapterFolder,
baseFolder, urlRoot) {
return function(request, response, next) {
var requestUrl = request.url.replace(/\?.*/, '');

if (requestUrl === urlRoot.substr(0, urlRoot.length - 1)) {
response.setHeader('Location', urlRoot);
response.writeHead(301);
return response.end('MOVED PERMANENTLY');
}
