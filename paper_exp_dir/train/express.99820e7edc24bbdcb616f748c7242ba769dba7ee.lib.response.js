




var fs = require('fs')
, http = require('http')
, path = require('path')
, pump = require('sys').pump
, utils = require('connect').utils
, parseRange = require('./utils').parseRange
, mime = utils.mime
, res = http.ServerResponse.prototype;



var multiple = ['Set-Cookie'];



res.send = function(body, headers, status){

if (typeof headers === 'number') {
status = headers,
headers = null;
