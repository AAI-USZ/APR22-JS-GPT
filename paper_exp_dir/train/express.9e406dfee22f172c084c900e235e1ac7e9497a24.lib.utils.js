


var mime = require('connect').mime
, crc32 = require('buffer-crc32');



var toString = {}.toString;



exports.etag = function(body){
return '"' + crc32.signed(body) + '"';
};



exports.locals = function(obj){
function locals(obj){
for (var key in obj) locals[key] = obj[key];
return obj;
};

return locals;
};



exports.isAbsolute = function(path){
if ('/' == path[0]) return true;
if (':' == path[1] && '\\' == path[2]) return true;
if ('\\\\' == path.substring(0, 2)) return true;
};



exports.flatten = function(arr, ret){
var ret = ret || []
, len = arr.length;
for (var i = 0; i < len; ++i) {
if (Array.isArray(arr[i])) {
exports.flatten(arr[i], ret);
} else {
