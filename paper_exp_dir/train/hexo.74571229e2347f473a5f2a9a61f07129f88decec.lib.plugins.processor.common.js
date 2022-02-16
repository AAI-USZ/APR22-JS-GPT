'use strict';

var Pattern = require('hexo-util').Pattern;
var moment = require('moment');

function isTmpFile(path){
var last = path[path.length - 1];
return last === '%' || last === '~';
}

