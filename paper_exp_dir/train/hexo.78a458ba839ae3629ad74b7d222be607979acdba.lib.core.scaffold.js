

var async = require('async'),
path = require('path'),
fs = require('graceful-fs'),
util = require('../util'),
file = util.file2;



var defaults = exports.defaults = {
normal: [
'layout: {{ layout }}',
'title: {{ title }}',
'date: {{ date }}',
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
'date: {{ date }}',
'---'
].join('\n') + '\n',
draft: [
'title: {{ title }}',
'tags:',
'---'
].join('\n') + '\n'
};

var _getScaffoldPath = function(layout, callback){
var scaffoldDir = hexo.scaffold_dir;

async.waterfall([
function(next){
fs.exists(scaffoldDir, function(exist){
next(null, exist);
});
},
function(exist, next){
