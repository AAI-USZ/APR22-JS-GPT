


var mime = require('connect').mime
, crc32 = require('buffer-crc32');



exports.etag = function(body){
return '"' + crc32.signed(body) + '"';
};



exports.locals = function(obj){
obj.viewCallbacks = obj.viewCallbacks || [];

function locals(obj){
for (var key in obj) locals[key] = obj[key];
