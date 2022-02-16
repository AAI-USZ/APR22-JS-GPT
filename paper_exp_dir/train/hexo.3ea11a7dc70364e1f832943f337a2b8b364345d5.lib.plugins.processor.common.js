var Pattern = require('hexo-util').Pattern;
var moment = require('moment');

function isTmpFile(path){
var last = path[path.length - 1];
return last === '%' || last === '~';
}

function isHiddenFile(path){
if (path[0] === '_') return true;
return /\/_/.test(path);
