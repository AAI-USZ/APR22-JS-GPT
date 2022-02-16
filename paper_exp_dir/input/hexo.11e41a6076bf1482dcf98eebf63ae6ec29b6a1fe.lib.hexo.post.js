'use strict';

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
var rSwigFullBlock = /\{% *(.+?)(?: *| +.*)%\}[\s\S]+?\{% *end\1 *%\}/g;
var placeholder = '\uFFFC';
var rPlaceholder = /(?:<|&lt;)\!--\uFFFC(\d+)--(?:>|&gt;)/g;

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

data.layout = (data.layout || config.default_layout).toLowerCase();
data.date = data.date ? moment(data.date) : moment();

return Promise.all([

ctx.execFilter('new_post_path', data, {
args: [replace],
context: ctx
}),

this._getScaffold(data.layout)
]).spread(function(path, scaffold){
data.date = data.date.format('YYYY-MM-DD HH:mm:ss');


var split = yfm.split(scaffold);
var separator = split.separator || '---';
var jsonMode = separator[0] === ';';

var frontMatter;

if (jsonMode){
frontMatter = prepareJFM(_.clone(data));
} else {
frontMatter = prepareYFM(_.clone(data));
}


var content = swig.compile(split.data)(frontMatter) + '\n';


var compiled;

if (jsonMode){
compiled = JSON.parse('{' + content + '}');
} else {
compiled = yaml.load(content);
}


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
if (jsonMode){
if (content){
content = content.trim() + ',\n';
}

content += JSON.stringify(obj, null, '  ')

.replace(/\n {2}/g, function(){
return '\n';
})

.replace(/^{\n|}$/g, '');
} else {
content += yaml.dump(obj);
}
}


if (split.prefixSeparator) content = separator + '\n' + content;
content += separator + '\n';


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



function prepareJFM(data){
var keys = Object.keys(data);
var key = '';
var item;

for (var i = 0, len = keys.length; i < len; i++){
key = keys[i];
item = data[key];

if (typeof item === 'string'){
data[key] = '"' + item + '"';
}
}

return data;
}

function prepareYFM(data){
data.title = '"' + data.title + '"';

return data;
}

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
var regex = new RegExp('^' + escapeRegExp(slug) + '(?:[^\\/\\\\]+)');
var self = this;
var src = '';
var result = {};

data.layout = (data.layout || config.default_layout).toLowerCase();


return fs.listDir(draftDir).then(function(list){
var item = '';

for (var i = 0, len = list.length; i < len; i++){
item = list[i];
if (regex.test(item)) return item;
}
}).then(function(item){
if (!item) throw new Error('Draft "' + slug + '" does not exist.');


src = pathFn.join(draftDir, item);
return fs.readFile(src);
}).then(function(content){

_.extend(data, yfm(content));
data.content = data._content;
delete data._content;

return self.create(data, replace).then(function(post){
result.path = post.path;
result.content = post.content;
});
}).then(function(){

return fs.unlink(src);
}).then(function(){
if (!config.post_asset_folder) return;


var assetSrc = removeExtname(src);
var assetDest = removeExtname(result.path);

return fs.exists(assetSrc).then(function(exist){
if (!exist) return;

return fs.copyDir(assetSrc, assetDest).then(function(){
return fs.rmdir(assetSrc);
});
});
}).thenReturn(result).nodeify(callback);
};

Post.prototype.render = function(source, data, callback){
data = data || {};

var ctx = this.context;
var config = ctx.config;
var cache = [];
var tag = ctx.extend.tag;
var isSwig = data.engine === 'swig' || (source && pathFn.extname(source) === '.swig');

