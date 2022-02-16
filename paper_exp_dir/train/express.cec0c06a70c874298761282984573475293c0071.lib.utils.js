


var mime = require('connect').mime
, crc32 = require('buffer-crc32');



var toString = {}.toString;



exports.etag = function(body){
return '"' + crc32.signed(body) + '"';
};



exports.locals = function(){
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
ret.push(arr[i]);
}
}
return ret;
};



exports.normalizeType = function(type){
return ~type.indexOf('/')
? acceptParams(type)
: { value: mime.lookup(type), params: {} };
};



exports.normalizeTypes = function(types){
var ret = [];

for (var i = 0; i < types.length; ++i) {
ret.push(exports.normalizeType(types[i]));
}

return ret;
};




function acceptParams(str, index) {
var parts = str.split(/ *; */);
var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };

for (var i = 1; i < parts.length; ++i) {
var pms = parts[i].split(/ *= */);
if ('q' == pms[0]) {
ret.quality = parseFloat(pms[1]);
} else {
ret.params[pms[0]] = pms[1];
