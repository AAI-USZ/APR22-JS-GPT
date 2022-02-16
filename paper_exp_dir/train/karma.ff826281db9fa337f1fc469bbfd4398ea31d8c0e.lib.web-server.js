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
