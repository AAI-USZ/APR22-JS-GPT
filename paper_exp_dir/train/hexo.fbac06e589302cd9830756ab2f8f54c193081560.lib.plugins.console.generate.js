var async = require('async'),
colors = require('colors'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('underscore'),
extend = require('../../extend'),
route = require('../../route'),
util = require('../../util'),
file = util.file,
spawn = util.spawn,
stdout = hexo.process.stdout,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir,
config = hexo.config,
maxOpenFile = config && config.max_open_file ? config.max_open_file : 100,
cache = {};

var process = function(list, callback){
var arr = route.list(),
keys = Object.keys(arr),
width = stdout.getWindowSize()[0],
total = keys.length,
now = 1;

if (!keys.length){
return console.log('Everything is up to date. You can add %s/%s option to rebuild the site.', '-r'.bold, '--rebuild'.bold);
}

async.parallel([
function(next){
fs.exists(publicDir, function(exist){
if (!exist) return next();
file.empty(publicDir, keys.concat(hexo.cache.assets), next);
})
