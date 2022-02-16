




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



exports.miniMarkdown = function(str){
return String(str)
.replace(/(__|\*\*)(.*?)\1/g, '<strong>$2</strong>')
.replace(/(_|\*)(.*?)\1/g, '<em>$2</em>')
.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
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
ok = (type[0] == obj.type || '*' == obj.type)
&& (type[1] == obj.subtype || '*' == obj.subtype);
if (ok) return true;
}

return false;
};



exports.parseAccept = function(str){
return exports
.parseQuality(str)
.map(function(obj){
var parts = obj.value.split('/');
obj.type = parts[0];
obj.subtype = parts[1];
return obj;
});
};



exports.parseQuality = function(str){
return str
.split(/ *, */)
.map(quality)
.filter(function(obj){
return obj.quality;
})
.sort(function(a, b){
return b.quality - a.quality;
});
};



