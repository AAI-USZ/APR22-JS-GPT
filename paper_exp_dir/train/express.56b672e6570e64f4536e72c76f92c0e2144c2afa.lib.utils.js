

var mime = require('send').mime;
var crc32 = require('buffer-crc32');
var basename = require('path').basename;



exports.etag = function(body){
return '"' + crc32.signed(body) + '"';
};



exports.isAbsolute = function(path){
if ('/' == path[0]) return true;
if (':' == path[1] && '\\' == path[2]) return true;
if ('\\\\' == path.substring(0, 2)) return true;
