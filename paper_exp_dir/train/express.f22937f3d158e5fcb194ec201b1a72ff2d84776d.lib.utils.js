



var contentType = require('content-type');
var etag = require('etag');
var mime = require('connect').mime;
var proxyaddr = require('proxy-addr');



var toString = {}.toString;



exports.etag = function (body, encoding) {
var buf = !Buffer.isBuffer(body)
