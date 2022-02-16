var extend = require('../../extend'),
generate = require('../../generate'),
route = require('../../route'),
call = require('../../call'),
util = require('../../util'),
file = util.file,
async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
term = require('term'),
config = hexo.config,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir,
maxOpenFile = config && config.max_open_file ? config.max_open_file : 100;

extend.console.register('generate', 'Generate static files', function(args, callback){
var watch = args.w || args.watch ? true : false,
deploy = args.d || args.deploy ? true : false,
start = new Date(),
cache = {};

console.log('Loading.');
hexo.emit('generateBefore');

generate({watch: watch}, function(){
var list = route.list(),
keys = Object.keys(list);

