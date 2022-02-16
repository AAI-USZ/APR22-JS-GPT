var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
chokidar = require('chokidar'),
colors = require('colors'),
domain = require('domain'),
EventEmitter = require('events').EventEmitter,
Pattern = require('./pattern'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2,
escape = util.escape,
File = require('./file');



var Box = module.exports = function Box(base, options){

this.base = base;


this.processors = [];


this.processingFiles = {};


this.watcher = null;


this.isProcessing = false;


this.options = _.extend({
presistent: true,
ignored: /[\/\\]\./,
ignoreInitial: true
}, options);
};

Box.prototype.__proto__ = EventEmitter.prototype;


Box.prototype.addProcessor = function(pattern, fn){
if (!(pattern instanceof Pattern)) pattern = new Pattern(pattern);

this.processors.push({
pattern: pattern,
process: fn
});
};


Box.prototype._dispatch = function(type, path, callback){
if (typeof callback !== 'function') callback = function(){};


if (this.processingFiles[path]) return callback();


path = path.replace(/\\/g, '/');

var self = this,
d = domain.create(),
called = false,
processorNumber = 0,
start = Date.now();

this.processingFiles[path] = true;


d.on('error', function(err){
self.processingFiles[path] = false;

if (called) return;
called = true;

if (!(err instanceof HexoError)) err = HexoError.wrap(err, 'Process failed: ' + path);
callback(err);
});

async.each(this.processors, function(processor, next){
var params = {},
src = pathFn.join(self.base, path);

if (processor.pattern){
if (!processor.pattern.test(path)) return next();

params = processor.pattern.match(path);
}

d.add(processor);

d.run(function(){
processor.process(new File(self, src, path, type, params), function(err){
processorNumber++;
d.remove(processor);
next(err);
});
});
}, function(err){
self.processingFiles[path] = false;

if (called) return;
called = true;

if (err){
if (!(err instanceof HexoError)) err = HexoError.wrap(err, 'Process failed: ' + path);
callback(err);
} else {
if (processorNumber) hexo.log.d('Processed: %s ' + '(%dms)'.grey, path, Date.now() - start);
callback();
}
});
};


Box.prototype._loadFileList = function(callback){
var Cache = hexo.model('Cache'),
fullBase = this.base,
base = fullBase.substring(hexo.base_dir.length),
baseLength = base.length,
baseRegex = new RegExp('^' + escape.regex(base)),
result = [];

var cache = Cache.find({_id: baseRegex}).map(function(item){
return item._id.substring(baseLength);
});

async.auto({
list: function(next){
file.list(fullBase, next);
},
created: ['list', function(next, results){
var created = _.difference(results.list, cache);

async.each(created, function(item, next){
fs.stat(pathFn.join(fullBase, item), function(err, stats){
if (err) return next(err);

Cache.insert({
_id: pathFn.join(base, item),
mtime: stats.mtime.getTime()
}, function(){
result.push({path: item, type: 'create'});
next();
});
});
}, function(err){
if (err) return next(err);

next(null, created);
});
}],
deleted: ['list', function(next, results){
var deleted = _.difference(cache, results.list);

async.each(deleted, function(item, next){
Cache.removeById(pathFn.join(base, item), function(){
result.push({path: item, type: 'delete'});
next();
});
}, function(err){
if (err) return next(err);

next(null, deleted);
});
}],
updated: ['deleted', function(next, results){
var updated = _.difference(cache, results.deleted);

async.each(updated, function(item, next){
fs.stat(pathFn.join(fullBase, item), function(err, stats){
if (err) return next(err);

var data = Cache.get(pathFn.join(base, item)),
mtime = stats.mtime.getTime();

if (data.mtime === mtime){
result.push({path: item, type: 'skip'});
next();
} else {
data.mtime = mtime;
data.save(function(){
result.push({path: item, type: 'update'});
next();
});
}
});
}, function(err){
if (err) return next(err);

next(null, updated);
});
}]
}, function(err){
callback(null, result);
});
};


Box.prototype.process = function(files, callback){
if (!callback){
if (typeof files === 'function'){
callback = files;
files = null;
} else {
callback = function(){};
}
}

if (this.isProcessing) return callback(new Error('Box is processing!'));

var self = this,
base = this.base;

this.isProcessing = true;


hexo.emit('processBefore', base);

async.waterfall([
function(next){
if (files){
if (!Array.isArray(files)) files = [files];

next(null, files);
} else {
self._loadFileList(next);
}
},
function(files, next){
async.each(files, function(item, next){
var type, path;

if (_.isObject(item)){
path = item.path;
type = item.type;
} else {
path = item;
type = 'update';
}

self._dispatch(type, path, next);
}, next);
}
], function(err){
self.isProcessing = false;



hexo.emit('processAfter', base);
callback(err);
});
};

var chokidarEventMap = {
add: 'create',
change: 'update',
unlink: 'delete'
};



Box.prototype.watch = function(){
if (this.watcher) throw new Error('Watcher has already started.');

var self = this,
queue = [],
isRunning = false,
timer;

var timerFn = function(){
if (queue.length && !isRunning){
isRunning = true;

self.process(queue, function(err){
isRunning = false;
queue.length = 0;

if (err) return hexo.log.e(err);
});
}
};

this.watcher = chokidar.watch(this.base, this.options)
.on('all', function(event, src){
var type = chokidarEventMap[event],
path = src.substring(self.base.length);

if (!type) return;
if (timer) clearTimeout(timer);

queue.push({
type: type,
path: path
});

timer = setTimeout(timerFn, 100);
hexo.log.log(type, src);
})
.on('error', function(err){
self.emit('error', err);
});
};


Box.prototype.unwatch = function(){
if (!this.watcher) throw new Error('Watcher hasn\'t started yet.');

this.watcher.stop();
this.watcher = null;
};


Box.File = Box.prototype.File = File;


Box.Pattern = Box.prototype.Pattern = Pattern;
