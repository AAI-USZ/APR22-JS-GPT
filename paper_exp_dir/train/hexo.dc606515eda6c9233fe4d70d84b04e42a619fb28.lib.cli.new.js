var moment = require('moment'),
colors = require('colors'),
fs = require('graceful-fs'),
async = require('async'),
path = require('path'),
sep = path.sep,
swig = require('swig'),
extend = require('../extend'),
util = require('../util'),
file = util.file;

var escape = function(str){
return str.toLowerCase()
.replace(/\s/g, '-')
.replace(/\\|\/|<|>|:|"|\||\?|\*/g, '');
};
