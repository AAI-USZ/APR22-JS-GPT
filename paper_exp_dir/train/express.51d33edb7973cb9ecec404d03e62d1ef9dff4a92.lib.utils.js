

var mime = require('send').mime;
var basename = require('path').basename;
var etag = require('etag');
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');
var typer = require('media-typer');



exports.etag = function (body, encoding) {
var buf = !Buffer.isBuffer(body)
? new Buffer(body, encoding)
