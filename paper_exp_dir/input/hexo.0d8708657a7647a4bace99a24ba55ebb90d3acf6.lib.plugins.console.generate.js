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
stdout = process.stdout,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir,
config = hexo.config,
maxOpenFile = config && config.max_open_file ? config.max_open_file : 100,
cache = {};

var processFn = function(list, callback){
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
},
function(next){
if (!list){
stdout.write('Generating.');
}

var queue = async.queue(function(i, next){
arr[i](function(err, result){
if (err) throw new Error('Generate Error: ' + key);

if (list){
var txt = '  create   ',
process = '(' + now++ + '/' + total + ')';
name = '';

if (i.length + txt.length > width - process.length - 1){
name += i.substring(0, width - txt.length - process.length - 2) + '…';
} else {
name += i;
}

stdout.write(txt.green.bold + name);
stdout.cursorTo(width - process.length);
stdout.write(process.grey + '\n');
} else {
var txt = 'Generating. ' + (now / total * 100).toFixed(2) + '% (' + now++ + '/' + total + ') ';
if ((txt + i).length > width){
txt += (i.substring(0, width - txt.length - 1) + '…').grey;
} else {
txt += i.grey;
}

stdout.clearLine();
stdout.cursorTo(0);
stdout.write(txt);
}

if (result.readable){
file.copy(result.path, publicDir + i, next);
} else {
