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

data.box.scaffolds[name] = {
path: data.source,
content: content
};

callback();
});
};


var Scaffold = module.exports = function Scaffold(){
Box.call(this, hexo.scaffold_dir);


this.asset_dir = pathFn.join(hexo.core_dir, 'assets', 'scaffolds');


this.scaffolds = {};


this.defaults = {
normal: [
'layout: {{ layout }}',
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n') + '\n'
};

this.processors.push({process: process});
};

Scaffold.prototype.__proto__ = Box.prototype;


Scaffold.prototype.get = function(layout, callback){
if (this.scaffolds[layout] != null){
return callback(null, this.scaffolds[layout].content);
} else if (this.defaults[layout] != null){
return callback(null, this.defaults[layout]);
}

var scaffoldPath = pathFn.join(this.asset_dir, layout + '.md'),
self = this;

fs.exists(scaffoldPath, function(exist){
if (!exist) return callback();

file.readFile(scaffoldPath, function(err, content){
if (err) return callback(err);

self.defaults[getScaffoldName(layout)] = content;

callback(null, content);
});
});
};


Scaffold.prototype.set = function(layout, content, callback){
if (typeof callback !== 'function') callback = function(){};

var scaffoldPath = '',
self = this;

if (this.scaffolds[layout] != null){
scaffoldPath = this.scaffolds[layout].path;
} else {
scaffoldPath = pathFn.join(hexo.scaffold_dir, layout);
if (!pathFn.extname(scaffoldPath)) scaffoldPath += '.md';
}

