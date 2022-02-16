'use strict';

var pathFn = require('path');
var Promise = require('bluebird');

function getExtname(str){
var extname = pathFn.extname(str) || str;
return extname[0] === '.' ? extname.slice(1) : extname;
}

