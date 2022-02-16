var http = require('http'),
u = require('./util'),
path = require('path'),
httpProxy = require('http-proxy'),
proxy = require('./proxy'),
fs = require('fs'),
log = require('./logger').create('web server'),
util = require('util');

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


exports.createWebServer = function (fileList, baseFolder, proxies, urlRoot) {
var staticFolder = path.normalize(__dirname + '/../static');
