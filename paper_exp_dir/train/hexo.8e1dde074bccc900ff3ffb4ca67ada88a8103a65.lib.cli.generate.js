var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async'),
clc = require('cli-color'),
fs = require('fs'),
_ = require('underscore'),
publicDir = hexo.public_dir;

extend.console.register('generate', 'Generate static files', function(args){
args = args.join().toLowerCase();

var ignoreTheme = args.match(/-t|--theme/i) ? true : false,
watch = args.match(/-w|--watch/i) ? true : false,
start = new Date();

console.log('Loading.');
hexo.emit('generateBefore');

require('../generate')({ignore: ignoreTheme, watch: watch}, function(err, cache){
var list = route.list(),
keys = Object.keys(list);

