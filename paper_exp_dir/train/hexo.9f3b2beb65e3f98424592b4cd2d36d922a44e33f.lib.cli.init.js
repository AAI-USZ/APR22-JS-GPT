var path = require('path'),
async = require('async'),
colors = require('colors'),
moment = require('moment'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
coreDir = hexo.core_dir;

extend.console.register('init', 'Initialize', function(args){
var target = process.cwd();

if (args._[0]) target = path.resolve(target, args._[0]);

console.log('Initializing.');

async.auto({
