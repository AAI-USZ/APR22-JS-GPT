


var mime = require('connect').mime
, proxyaddr = require('proxy-addr')
, crc32 = require('buffer-crc32')
, crypto = require('crypto');



var toString = {}.toString;


var charsetRegExp = /;\s*charset\s*=/;



exports.etag = function etag(body, encoding){
if (body.length === 0) {
