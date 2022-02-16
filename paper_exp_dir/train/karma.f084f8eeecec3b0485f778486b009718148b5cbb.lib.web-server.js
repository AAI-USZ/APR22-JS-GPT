var http = require('http');
var u = require('./util');
var path = require('path');
var httpProxy = require('http-proxy');
var proxy = require('./proxy');
var fs = require('fs');
var log = require('./logger').create('web server');
var util = require('util');
var querystring = require('querystring');

var SCRIPT_TAG = '<script type="text/javascript" src="%s"></script>';
var MIME_TYPE = {
txt: 'text/plain',
html: 'text/html',
js: 'application/javascript'
};

var setNoCacheHeaders = function(response) {
