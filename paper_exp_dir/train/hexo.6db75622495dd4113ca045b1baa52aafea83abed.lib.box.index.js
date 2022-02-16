var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var Pattern = require('./pattern');
var util = require('../util');
var fs = require('hexo-fs');
var prettyHrtime = require('pretty-hrtime');
var crypto = require('crypto');
var tildify = require('tildify');

var escape = util.escape;
var join = pathFn.join;
var sep = pathFn.sep;
var rSep = new RegExp(escape.regex(sep), 'g');

require('colors');

function Box(ctx, base, options){
this.options = _.extend({
presistent: true,
ignored: /[\/\\]\./,
ignoreInitial: true
}, options);

if (base.substring(base.length - 1) !== sep){
base += sep;
}

this.context = ctx;
this.base = base;
this.processors = [];
this.processingFiles = {};
this.watcher = null;
this.Cache = ctx.model('Cache');
this.bufferStore = {};

var _File = this.File = function(data){
File.call(this, data);
};

util.inherits(_File, File);

_File.prototype.box = this;

_File.prototype.render = function(options, callback){
if (!callback && typeof options === 'function'){
callback = options;
options = {};
}

var self = this;

return this.read().then(function(content){
return ctx.render.render({
text: content,
path: self.source
}, options)
}).nodeify(callback);
};

