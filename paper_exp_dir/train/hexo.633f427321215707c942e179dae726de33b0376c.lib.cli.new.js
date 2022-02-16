var moment = require('moment'),
clc = require('cli-color'),
fs = require('graceful-fs'),
async = require('async'),
path = require('path'),
sep = path.sep,
extend = require('../extend'),
util = require('../util'),
file = util.file;

var escape = function(str){
return str.toLowerCase()
.replace(/\s/g, '-')
.replace(/\\|\/|<|>|:|"|\||\?|\*/g, '');
};


var scaffolds = {
post: [
'---',
