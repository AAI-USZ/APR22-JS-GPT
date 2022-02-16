var fs = require('fs'),
http = require('http'),
util = require('util');

var SCRIPT_TAG = '<script type="text/javascript" src="%s"></script>';
var MIME_TYPE = {
txt: 'text/plain',
html: 'text/html',
js: 'application/javascript'
};

var createHandler = function(fileGuardian, STATIC_FOLDER) {
return function(request, response) {


var serveStaticFile = function(file, process) {
fs.readFile(file, function(error, data) {
