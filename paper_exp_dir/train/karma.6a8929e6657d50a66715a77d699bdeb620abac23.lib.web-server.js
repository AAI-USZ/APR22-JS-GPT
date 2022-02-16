var fs = require('fs'),
http = require('http'),
util = require('util'),
u = require('./util'),
path = require('path'),
log = require('./logger').create('web server'),
url = require('url'),
httpProxy = require('http-proxy');

var SCRIPT_TAG = '<script type="text/javascript" src="%s"></script>';
var MIME_TYPE = {
txt: 'text/plain',
html: 'text/html',
js: 'application/javascript'
};
