var async = require('async'),
term = require('term'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('underscore'),
extend = require('../../extend'),
route = require('../../route'),
util = require('../../util'),
file = util.file,
spawn = util.spawn,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir,
config = hexo.config,
maxOpenFile = config && config.max_open_file ? config.max_open_file : 100;

extend.console.register('generate', 'Generate static files', function(args){
var generate = require('../../generate'),
watch = args.w || args.watch ? true : false,
deploy = (args.d || args.deploy) && !watch ? true : false,
rebuild = args.r || args.rebuild ? true : false,
start = new Date();

console.log('Loading.');
hexo.emit('generateBefore');
