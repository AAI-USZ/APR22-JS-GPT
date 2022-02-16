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
processorNumber = 0;

this.processingFiles[path] = true;

