


var mime = require('connect').mime
, deprecate = require('util').deprecate
, proxyaddr = require('proxy-addr')
, crc32 = require('buffer-crc32');



var toString = {}.toString;


var charsetRegExp = /;\s*charset\s*=/;



exports.deprecate = function(fn, msg){
if (process.env.NODE_ENV === 'test') return fn;


msg = 'express: ' + msg;

if (process.stderr.isTTY) {

msg = '\x1b[31;1m' + msg + '\x1b[0m';
