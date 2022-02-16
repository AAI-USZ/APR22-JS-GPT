



var contentDisposition = require('content-disposition');
var contentType = require('content-type');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var mime = require('send').mime;
var basename = require('path').basename;
var etag = require('etag');
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');



exports.etag = function (body, encoding) {
var buf = !Buffer.isBuffer(body)
