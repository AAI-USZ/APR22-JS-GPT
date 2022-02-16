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
return str.toString().toLowerCase()
.replace(/\s/g, '-')
.replace(/\\|\/|<|>|:|"|\||\?|\*/g, '');
};


var scaffolds = {
post: [
'title: {{ title }}',
'date: {{ date }}',
'tags:',
