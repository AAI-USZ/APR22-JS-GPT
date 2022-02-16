



exports.filename = function(str, transform){
var result = str.toString().toLowerCase()
.replace(/\s/g, '-')
.replace(/\/|\\|\?|%|\*|:|\||'|"|<|>|\.|#/g, '');

if (transform == 1){
result = result.toLowerCase();
} else if (transform == 2){
