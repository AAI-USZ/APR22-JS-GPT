var fs = require('fs');
var http = require('http');
var path = require('path');
var util = require('util');
var querystring = require('querystring');
var httpProxy = require('http-proxy');

var helper = require('./helper');
var proxy = require('./proxy');
var log = require('./logger').create('web server');

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

exports.createWebServer = function (baseFolder, proxies, urlRoot) {
var staticFolder = path.normalize(__dirname + '/../static');
var adapterFolder = path.normalize(__dirname + '/../adapter');

var promiseContainer = {
promise: null
};

var server = http.createServer(createHandler(promiseContainer,
helper.normalizeWinPath(staticFolder), helper.normalizeWinPath(adapterFolder), baseFolder,
