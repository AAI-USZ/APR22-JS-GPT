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
var slug = escape(data.slug || data.title, config.filename_case),
layout = data.layout || config.default_layout,
date = moment(data.date) || moment(),
target = sourceDir,
scaffold;

layout = layout.toLowerCase();

if (layout === 'page'){
target += slug + '/index.md';
} else {
var filename = config.new_post_name
.replace(':year', date.year())
.replace(':month', date.format('MM'))
.replace(':day', date.format('DD'))
.replace(':title', slug);

if (!path.extname(filename)) filename += '.md';

target += (layout === 'draft' ? '_drafts/' : '_posts/') + filename;
}

async.auto({

check: function(next){
if (data.replace) return next();

getFilename(target, function(err, _target){
if (err) return next(err);

target = _target;
next();
});
},

scaffold: ['check', function(next){
fs.exists(scaffoldDir, function(exist){
