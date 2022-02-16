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

var setNoCacheHeaders = function(response) {
response.setHeader('Cache-Control', 'no-cache');
response.setHeader('Pragma', 'no-cache');
response.setHeader('Expires', (new Date(0)).toString());
};



var createHandler = function(fileList, staticFolder, adapterFolder, baseFolder) {

return function(request, response) {

var files = fileList.getFiles();


var serveStaticFile = function(file, process) {
fs.readFile(file, function(error, data) {

if (error) {
log.warn('404: ' + file);
