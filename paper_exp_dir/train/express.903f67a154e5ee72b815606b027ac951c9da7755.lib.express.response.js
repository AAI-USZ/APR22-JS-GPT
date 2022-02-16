




var fs = require('fs'),
http = require('http'),
path = require('path'),
pump = require('sys').pump,
utils = require('connect/utils'),
mime = require('connect/utils').mime,
parseRange = require('./utils').parseRange,
Buffer = require('buffer').Buffer;



var multiple = ['Set-Cookie'];



http.ServerResponse.prototype.send = function(body, headers, status){

if (typeof headers === 'number') {
status = headers,
headers = null;
