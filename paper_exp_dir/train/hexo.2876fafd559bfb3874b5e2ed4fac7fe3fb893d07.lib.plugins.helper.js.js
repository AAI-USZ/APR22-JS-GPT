function jsHelper(){
var result = '';
var path = '';

for (var i = 0, len = arguments.length; i < len; i++){
path = arguments[i];

if (Array.isArray(path)){
result += jsHelper.apply(this, path);
} else {
