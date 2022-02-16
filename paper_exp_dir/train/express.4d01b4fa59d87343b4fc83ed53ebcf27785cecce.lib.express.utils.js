




exports.miniMarkdown = function(str){
return String(str)
.replace(/(__|\*\*)(.*?)\1/g, '<strong>$2</strong>')
.replace(/(_|\*)(.*?)\1/g, '<em>$2</em>')
.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
};



exports.htmlEscape = function(html) {
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
var range = range.split('-'),
start = parseInt(range[0], 10),
end = parseInt(range[1], 10);


if (isNaN(start)) {
start = size - end;
end = size - 1;

