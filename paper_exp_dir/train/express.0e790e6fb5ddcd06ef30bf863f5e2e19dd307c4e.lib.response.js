




var fs = require('fs')
, http = require('http')
, path = require('path')
, utils = require('connect').utils
, parseRange = require('./utils').parseRange
, res = http.ServerResponse.prototype
, mime = utils.mime;



var multiple = ['Set-Cookie'];



res.send = function(body, headers, status){

if (typeof headers === 'number') {
