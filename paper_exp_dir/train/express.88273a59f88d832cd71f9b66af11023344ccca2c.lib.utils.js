


var mime = require('connect').mime
, crc32 = require('buffer-crc32');



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



exports.acceptsArray = function(types, str){

if (!str) return types[0];


var accepted = exports.parseAccept(str)
, normalized = exports.normalizeTypes(types)
, len = accepted.length;

for (var i = 0; i < len; ++i) {
for (var j = 0, jlen = types.length; j < jlen; ++j) {
if (exports.accept(normalized[j], accepted[i])) {
return types[j];
}
}
}
};



exports.accepts = function(type, str){
if ('string' == typeof type) type = type.split(/ *, */);
return exports.acceptsArray(type, str);
};



exports.accept = function(type, other){
var t = type.value.split('/');
return (t[0] == other.type || '*' == other.type)
&& (t[1] == other.subtype || '*' == other.subtype)
&& paramsEqual(type.params, other.params);
};



function paramsEqual(a, b){
return !Object.keys(a).some(function(k) {
return a[k] != b[k];
});
}



exports.parseAccept = function(str){
return exports
.parseParams(str)
.map(function(obj){
var parts = obj.value.split('/');
obj.type = parts[0];
obj.subtype = parts[1];
return obj;
});
};



exports.parseParams = function(str){
return str
.split(/ *, */)
.map(acceptParams)
.filter(function(obj){
return obj.quality;
})
.sort(function(a, b){
if (a.quality === b.quality) {
return a.originalIndex - b.originalIndex;
} else {
return b.quality - a.quality;
}
});
};



function acceptParams(str, index) {
