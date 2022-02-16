'use strict';

var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var util = require('hexo-util');
var fs = require('hexo-fs');
var chalk = require('chalk');
var EventEmitter = require('events').EventEmitter;

var Pattern = util.Pattern;
var join = pathFn.join;
var sep = pathFn.sep;

var defaultPattern = new Pattern(function() {
return {};
});

function Box(ctx, base, options) {
EventEmitter.call(this);

this.options = _.assign({
persistent: true
}, options);

if (base.substring(base.length - 1) !== sep) {
base += sep;
}

this.context = ctx;
this.base = base;
this.processors = [];
this.processingFiles = {};
this.watcher = null;
this.Cache = ctx.model('Cache');
this.File = this._createFileClass();
}

require('util').inherits(Box, EventEmitter);

function escapeBackslash(path) {

return path.replace(/\\/g, '/');
}

function getHash(path) {
return new Promise(function(resolve, reject) {
var src = fs.createReadStream(path);
var hasher = new util.HashStream();

src.pipe(hasher)
.on('finish', function() {
resolve(hasher.read().toString('hex'));
})
.on('error', reject);
});
}

Box.prototype._createFileClass = function() {
var ctx = this.context;

var _File = function(data) {
File.call(this, data);
};

require('util').inherits(_File, File);

_File.prototype.box = this;

_File.prototype.render = function(options, callback) {
