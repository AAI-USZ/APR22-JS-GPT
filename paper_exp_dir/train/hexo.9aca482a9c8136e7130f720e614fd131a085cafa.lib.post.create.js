

var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
moment = require('moment'),
swig = require('swig'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape.filename;

var config = hexo.config,
scaffoldDir = hexo.scaffold_dir,
sourceDir = hexo.source_dir;



var scaffolds = {
draft: [
'title: {{ title }}',
'tags:',
'---'
].join('\n') + '\n',
post: [
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n') + '\n',
page: [
'title: {{ title }}',
