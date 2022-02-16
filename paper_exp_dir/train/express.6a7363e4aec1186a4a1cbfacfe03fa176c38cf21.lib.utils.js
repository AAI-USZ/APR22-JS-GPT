


var mime = require('connect').mime
, crc32 = require('buffer-crc32')
, parse = require('url').parse;



var toString = {}.toString;



exports.etag = function(body){
return '"' + crc32.signed(body) + '"';
};



exports.isAbsolute = function(path){
