var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
chokidar = require('chokidar'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2;

var rTmpFile = /[~%]$/;

var isRunning = false,
isReady = false,
processingFiles = {};

var _getProcessor = function(path){
var tasks = [];

hexo.extend.processor.list().forEach(function(processor){
var match = path.match(processor.pattern);

if (!match) return;

var params = {};

for (var i = 0, len = match.length; i < len; i++){
var name = processor.params[i - 1];

params[i] = match[i];

if (name) params[name] = match[i];
}

tasks.push({
fn: processor.fn,
params: params
});
});

return tasks;
};

var ProcessData = function(src, type, params){
this.path = src;
this.source = pathFn.join(hexo.source_dir, src);
this.type = type;
this.params = params;
};

ProcessData.prototype.read = function(options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

var options = _.extend({
cache: false
}, options);

if (options.cache){
hexo.model('Cache').loadCache(this.path, callback);
} else {
file.readFile(this.source, callback);
}
};

ProcessData.prototype.stat = function(callback){
fs.stat(this.source, callback);
};

var process = exports.process = function(files, callback){
if (!Array.isArray(files)) files = [files];
if (typeof callback !== 'function') callback = function(){};

var sourceDir = hexo.source_dir;

hexo.emit('processBefore');

async.each(files, function(item, next){

if (_.isObject(item)){
var path = item.path,
type = item.type;
} else {
var path = item,
type = 'update';
}

var source = pathFn.join(sourceDir, path);


if (processingFiles[source]) return next();

path = path.replace(/\\/g, '/');


fs.exists(source, function(exist){
if (!exist && type !== 'delete') return next();

var tasks = _getProcessor(path);

processingFiles[source] = true;

async.each(tasks, function(task, next){
var data = new ProcessData(path, type, task.params);

task.fn(data, function(err){
if (err){
if (err instanceof HexoError){
return callback(err);
} else {
return callback(HexoError.wrap(err, 'Process failed: ' + path));
}
}

next();
});
}, function(err){
if (err) return callback(err);

processingFiles[source] = false;
hexo.log.d('Processed: ' + path);
next();
});
});
}, function(err){
if (err) return callback(err);

hexo.emit('processAfter');
callback();
});
};

var _saveDatabase = function(callback){
if (typeof callback !== 'function') callback = function(){};

var model = hexo.model;

var store = {
Asset: model('Asset')._store.list(),
Cache: model('Cache')._store.list()
};

file.writeFile(pathFn.join(hexo.base_dir, 'db.json'), JSON.stringify(store), function(err){
if (err) return callback(HexoError.wrap(err, 'Cache save failed'));
