var fs = require('fs');
var http = require('http');
var path = require('path');
var util = require('util');
var querystring = require('querystring');
var httpProxy = require('http-proxy');
var pause = require('pause');
var mime = require('mime');

var VERSION = require('./constants').VERSION;
var helper = require('./helper');
var proxy = require('./proxy');
var log = require('./logger').create('web server');

var SCRIPT_TAG = '<script type="%s" src="%s"></script>';
var LINK_TAG = '<link type="text/css" href="%s" rel="stylesheet">';


var setNoCacheHeaders = function(response) {
response.setHeader('Cache-Control', 'no-cache');
response.setHeader('Pragma', 'no-cache');
response.setHeader('Expires', (new Date(0)).toString());
};


var serveStaticFile = function(file, response, process) {
fs.readFile(file, function(error, data) {
