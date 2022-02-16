'use strict';

var strip = require('chalk').stripColor;

exports.stringLength = function(str){
str = strip(str);

var len = str.length;
var result = len;


