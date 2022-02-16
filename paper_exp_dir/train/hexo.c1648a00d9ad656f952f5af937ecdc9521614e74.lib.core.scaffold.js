var pathFn = require('path'),
fs = require('graceful-fs'),
Box = require('../box'),
util = require('../util'),
file = util.file2,
HexoError = require('../error');

var rHiddenFile = /\/_/;

var getScaffoldName = function(path){
return path.substring(hexo.scaffold_dir.length, path.length - pathFn.extname(path).length);
};

var process = function(data, callback){
if (data.path[0] === '_' || rHiddenFile.test(data.path)) return callback();

var name = getScaffoldName(data.source);

if (data.type === 'delete'){
data.box.scaffolds[name] = null;
return callback();
}

data.read(function(err, content){
if (err) return callback(HexoError.wrap(err, 'Scaffold load failed: ' + data.path));
