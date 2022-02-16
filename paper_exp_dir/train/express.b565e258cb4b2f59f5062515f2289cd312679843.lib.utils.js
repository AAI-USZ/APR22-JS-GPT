




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



exports.accepts = function(type, str){

if (!str) return true;


if (!~type.indexOf('/')) type = mime.lookup(type);


type = type.split('/');


var accepted = exports.parseAccept(str)
, len = accepted.length
, obj
, ok;

for (var i = 0; i < len; ++i) {
obj = accepted[i];
if (exports.accept(type, obj)) return true;
}

return false;
};



exports.accept = function(type, other){
return (type[0] == other.type || '*' == other.type)
&& (type[1] == other.subtype || '*' == other.subtype);
