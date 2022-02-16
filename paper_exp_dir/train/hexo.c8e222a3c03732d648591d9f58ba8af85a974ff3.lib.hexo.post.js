var moment = require('moment');
var swig = require('swig');
var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');
var util = require('hexo-util');
var fs = require('hexo-fs');
var yfm = require('hexo-front-matter');

var slugize = util.slugize;
var escapeRegExp = util.escapeRegExp;

var rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
var rSwigVar = /\{\{[\s\S]*?\}\}/g;
var rSwigComment = /\{#[\s\S]*?#\}/g;
var rSwigBlock = /\{%[\s\S]*?%\}/g;
var rSwigFullBlock = /\{% *(.*?) *%\}[\s\S]+?\{% *end\1 *%\}/g;
var placeholder = '\uFFFC';
var rPlaceholder = /(?:<p>)?\uFFFC(\d+)(?:<\/p>)?/g;

var preservedKeys = {
title: true,
slug: true,
path: true,
layout: true,
date: true,
content: true
};

swig.setDefaults({
autoescape: false
});

function Post(context){
this.context = context;
}

Post.prototype.create = function(data, replace, callback){
if (!callback && typeof replace === 'function'){
callback = replace;
replace = false;
}

var ctx = this.context;
var config = ctx.config;

data.slug = slugize(data.slug || data.title, {transform: config.filename_case});
data.layout = (data.layout || config.default_layout).toLowerCase();
data.date = data.date ? moment(data.date) : moment();

return Promise.all([

ctx.extend.filter.exec('new_post_path', data, {
args: [replace],
context: ctx
}),

this._getScaffold(data.layout)
]).spread(function(path, scaffold){

data.title = '"' + data.title + '"';
data.date = data.date.format('YYYY-MM-DD HH:mm:ss');


var split = yfm.split(scaffold);


var content = swig.compile(split.data)(data) + '\n';


var compiled = yaml.load(content);


var keys = Object.keys(data);
var key = '';
var obj = {};

for (var i = 0, len = keys.length; i < len; i++){
key = keys[i];

if (!preservedKeys[key] && !compiled.hasOwnProperty(key)){
obj[key] = data[key];
}
}

if (Object.keys(obj).length){
content += yaml.dump(obj);
}

content += '---\n';


content += split.content;

if (data.content){
content += '\n' + data.content;
}

var result = {
path: path,
content: content
};

return Promise.all([

fs.writeFile(path, content),

createAssetFolder(path, config.post_asset_folder)
]).then(function(){
ctx.emit('new', result);
}).thenReturn(result);
}).nodeify(callback);
};

Post.prototype._getScaffold = function(layout){
var ctx = this.context;

return ctx.scaffold.get(layout).then(function(result){
if (result != null) return result;
return ctx.scaffold.get('normal');
});
};

function createAssetFolder(path, assetFolder){
if (!assetFolder) return Promise.resolve();

var target = removeExtname(path);

return fs.exists(target).then(function(exist){
if (!exist) return fs.mkdirs(target);
});
}

function removeExtname(str){
return str.substring(0, str.length - pathFn.extname(str).length);
}

Post.prototype.publish = function(data, replace, callback){
if (!callback && typeof replace === 'function'){
callback = replace;
replace = false;
}

if (data.layout === 'draft') data.layout = 'post';

var ctx = this.context;
var config = ctx.config;
var draftDir = pathFn.join(ctx.source_dir, '_drafts');
var slug = data.slug = slugize(data.slug, {transform: config.filename_case});
var regex = new RegExp('^' + escapeRegExp(slug) + '(?:[^\\/\\\\]+)');
var self = this;
