var path = require('path'),
_ = require('underscore'),
store = {};

var format = function(str){
if (str.substr(0, 1) === '/') str = str.substring(1);

if (!path.extname(str)){
var last = str.substr(str.length - 1, 1);
if (last && last !== '/') str += '/';
str += 'index.html';
}

return str;
