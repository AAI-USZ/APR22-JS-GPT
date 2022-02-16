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
escape = util.escape.filename,
config = hexo.config,
sourceDir = hexo.source_dir,
scaffoldDir = hexo.scaffold_dir;


var scaffolds = {
post: [
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n') + '\n',
page: [
'title: {{ title }}',
'date: {{ date }}',
'---'
].join('\n') + '\n',
normal: [
'layout: {{ layout }}',
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n') + '\n'
};

var create = module.exports = function(data, callback){
var layout = data.layout || config.default_layout,
date = data.date = moment(data.date || Date.now());

layout = layout.toLowerCase();

async.auto({

target: function(next){
getFilename(data, function(err, target){
if (err) return next(err);
