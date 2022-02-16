var fs = require('fs'),
http = require('http'),
util = require('util'),
path = require('path'),
log = require('./logger').create('web server');

var SCRIPT_TAG = '<script type="text/javascript" src="%s"></script>';
var MIME_TYPE = {
txt: 'text/plain',
html: 'text/html',
js: 'application/javascript'
};

var createHandler = function(fileGuardian, STATIC_FOLDER) {
return function(request, response) {


var serveStaticFile = function(file, process) {
file = path.normalize(file);

fs.readFile(file, function(error, data) {

if (error) {
log.warn('404: ' + file);
response.writeHead(404);
return response.end('NOT FOUND');
}


response.setHeader('Content-Type', MIME_TYPE[file.split('.').pop()] || MIME_TYPE.txt);


var responseData = process && process(data.toString(), response) || data;
response.writeHead(200);

log.debug('serving: ' + file);
return response.end(responseData);
});
};




if (request.url === '/') {
return serveStaticFile(STATIC_FOLDER + '/client.html');
}


if (request.url === '/slimjim.js') {
return serveStaticFile(STATIC_FOLDER + '/slimjim.js');
}



if (request.url === '/context.html' || request.url === '/runner.html') {
return serveStaticFile(STATIC_FOLDER + request.url, function(data, response) {

response.setHeader('Cache-Control', 'no-cache');


var scriptTags = [];
fileGuardian.getFiles().forEach(function(file) {
