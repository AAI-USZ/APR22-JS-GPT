var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var util = require('hexo-util');
var fs = require('hexo-fs');
var prettyHrtime = require('pretty-hrtime');
var crypto = require('crypto');
var chalk = require('chalk');

var Pattern = util.Pattern;
var escapeRegExp = util.escapeRegExp;
var join = pathFn.join;
var sep = pathFn.sep;

var patternNoob = new Pattern(function(){
return {};
});

function Box(ctx, base, options){
this.options = _.extend({
persistent: true,
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
this.statStore = {};

var _File = this.File = function(data){
File.call(this, data);
};

require('util').inherits(_File, File);

