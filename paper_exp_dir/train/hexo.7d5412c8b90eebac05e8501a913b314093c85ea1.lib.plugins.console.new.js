var moment = require('moment'),
term = require('term'),
fs = require('graceful-fs'),
async = require('async'),
path = require('path'),
swig = require('swig'),
extend = require('../../extend'),
util = require('../../util'),
file = util.file;


var escape = function(str){
return str.toString().toLowerCase()
.replace(/\s/g, '-')
.replace(/\/|\\|\?|%|\*|:|\||"|<|>|\./g, '');
};


var scaffolds = {
post: [
'title: {{ title }}',
