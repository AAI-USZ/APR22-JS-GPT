




exports.union = function(a, b){
if (a && b) {
var keys = Object.keys(b)
, len = keys.length
, key;
for (var i = 0; i < len; ++i) {
key = keys[i];
if (!a.hasOwnProperty(key)) {
a[key] = b[key];
}
}
}
return a;
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



exports.escape = function(html) {
return String(html)
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;');
};

/**
* Parse "Range" header `str` relative to the given file `size`.
*
* @param {Number} size
* @param {String} str
* @return {Array}
* @api private
*/

exports.parseRange = function(size, str){
var valid = true;
var arr = str.substr(6).split(',').map(function(range){
var range = range.split('-')
, start = parseInt(range[0], 10)
, end = parseInt(range[1], 10);


if (isNaN(start)) {
start = size - end;
end = size - 1;

} else if (isNaN(end)) {
end = size - 1;
}


if (isNaN(start) || isNaN(end) || start > end) valid = false;

return { start: start, end: end };
});
return valid ? arr : undefined;
};
