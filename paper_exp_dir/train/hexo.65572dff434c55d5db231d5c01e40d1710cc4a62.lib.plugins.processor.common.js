'use strict';

var Pattern = require('hexo-util').Pattern;
var moment = require('moment-timezone');

var DURATION_MINUTE = 1000 * 60;

function isTmpFile(path){
var last = path[path.length - 1];
return last === '%' || last === '~';
}

function isHiddenFile(path){
if (path[0] === '_') return true;
