

var moment = require('moment'),
fs = require('graceful-fs'),
async = require('async'),
path = require('path'),
swig = require('swig'),
yaml = require('yamljs'),
_ = require('lodash'),
util = require('./util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape.filename;

var config = hexo.config,
scaffoldDir = hexo.scaffold_dir,
sourceDir = hexo.source_dir;



var scaffolds = {
post: [
'title: {{ title }}',
'date: {{ date }}',
