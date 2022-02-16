




var mime = require('mime');



exports.isAbsolute = function(path){
if ('/' == path[0]) return true;
if (':' == path[1] && '\\' == path[2]) return true;
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
return ~type.indexOf('/') ? type : mime.lookup(type);
};



exports.normalizeTypes = function(types){
var ret = [];

for (var i = 0; i < types.length; ++i) {
ret.push(~types[i].indexOf('/')
? types[i]
: mime.lookup(types[i]));
}

return ret;
};



exports.acceptsArray = function(types, str){

if (!str) return types[0];


var accepted = exports.parseAccept(str)
, normalized = exports.normalizeTypes(types)
, len = accepted.length;

for (var i = 0; i < len; ++i) {
for (var j = 0, jlen = types.length; j < jlen; ++j) {
if (exports.accept(normalized[j].split('/'), accepted[i])) {
return types[j];
}
}
}
};



exports.accepts = function(type, str){
if (!Array.isArray(type)) type = [type];
return exports.acceptsArray(type, str);
};



exports.accept = function(type, other){
return (type[0] == other.type || '*' == other.type)
&& (type[1] == other.subtype || '*' == other.subtype);
};



exports.parseAccept = function(str){
