




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



exports.parseQuality = function(str){
return str
.split(/ *, */)
.map(quality)
.sort(function(a, b){
return b.quality - a.quality;
});
};



function quality(str) {
var parts = str.split(/ *; */)
