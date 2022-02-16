


var mime = require('connect').mime
, crc32 = require('buffer-crc32');



var toString = {}.toString;



exports.etag = function(body){
return '"' + crc32.signed(body) + '"';
};



exports.locals = function(obj){
