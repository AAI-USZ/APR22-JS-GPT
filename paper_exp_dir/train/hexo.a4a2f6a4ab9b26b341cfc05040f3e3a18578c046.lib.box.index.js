var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
chokidar = require('chokidar'),
domain = require('domain'),
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


Box.prototype.addProcessor = function(pattern, fn){
this.processors.push({
pattern: new Pattern(pattern),
process: fn
});
};


Box.prototype._dispatch = function(type, path, callback){
if (typeof callback !== 'function') callback = function(){};

var self = this,
d = domain.create();

d.on('error', function(err){
return callback(HexoError.wrap(err, 'Process failed: ' + path));
});


path = path.replace(/\\/g, '/');


if (this.processingFiles[path]) return callback();

this.processingFiles[path] = true;

d.run(function(){
async.each(self.processors, function(processor, next){
var params = {},
src = pathFn.join(self.base, path);

if (processor.pattern){
if (!processor.pattern.test(path)) return next();

params = processor.pattern.match(path);
}

processor.process(new File(self, src, path, type, params), function(err){
