var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
chokidar = require('chokidar'),
EventEmitter = require('events').EventEmitter,
Pattern = require('./pattern'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2,
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

Box.prototype.addProcessor = function(rule, fn){
this.processors.push({
pattern: new Pattern(pattern),
process: fn
});
};

Box.prototype._dispatch = function(type, path, callback){
if (typeof callback !== 'function') callback = function(){};

var self = this;

async.each(this.processors, function(processor, next){
if (!processor.pattern.test(path)) return next();

var params = processor.pattern.match(path),
src = pathFn.join(self.base, path);

processor.process(new File(self, src, path, type, params), function(err){
if (err){
if (err instanceof HexoError){
return next(err);
} else {
return next(HexoError.wrap(err, 'Process failed: ' + path));
}
}

next();
});
}, function(err){
if (err) return callback(err);

self.processingFiles[path] = false;
hexo.log.d('Processed: %s', path);
callback();
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

