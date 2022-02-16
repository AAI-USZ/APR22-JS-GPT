var async = require('async'),
colors = require('colors'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('underscore'),
extend = require('../../extend'),
route = require('../../route'),
util = require('../../util'),
file = util.file,
stdout = hexo.process.stdout,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir,
config = hexo.config,
maxOpenFile = config && config.max_open_file ? config.max_open_file : 100;

extend.console.register('generate', 'Generate static files', function(args){
var generate = require('../../generate'),
start = new Date();

console.log('Loading.');
hexo.emit('generateBefore');
