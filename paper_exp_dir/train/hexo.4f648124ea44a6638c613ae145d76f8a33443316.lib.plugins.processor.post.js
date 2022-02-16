var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');
var fs = require('hexo-fs');
var util = require('hexo-util');
var escape = util.escape;
var Pattern = util.Pattern;
var Permalink = util.Permalink;

var postDir = '_posts/';
var draftDir = '_drafts/';
var permalink;

var preservedKeys = {
title: true,
year: true,
month: true,
day: true,
i_month: true,
i_day: true
};

function startsWith(str, prefix){
return str.substring(0, prefix.length) === prefix;
}

exports.process = function(file){
if (this.render.isRenderable(file.path)){
return processPost.call(this, file);
} else if (this.config.post_asset_folder){
return processAsset.call(this, file);
}
};

exports.pattern = new Pattern(function(path){
if (common.isTmpFile(path)) return false;

var result;

if (startsWith(path, postDir)){
result = {
published: true,
path: path.substring(postDir.length)
};
} else if (startsWith(path, draftDir)){
result = {
published: false,
path: path.substring(draftDir.length)
};
} else {
return false;
}

if (common.isHiddenFile(result.path)) return false;
return result;
});

function processPost(file){
var Post = this.model('Post');
var path = file.params.path;
var doc = Post.findOne({source: file.path});
var self = this;
var categories, tags;

if (file.type === 'skip' && doc){
return;
}

if (file.type === 'delete'){
if (doc){
return doc.remove();
} else {
return;
}
}

return Promise.all([
file.stat(),
file.read()
]).spread(function(stats, content){
var data = yfm(content);
var info = parseFilename(self.config.new_post_name, path);
var keys = Object.keys(info);
var key;

data.content = data._content;
data.source = file.path;
data.raw = content;
data.slug = info.title;

if (file.params.published){
if (!data.hasOwnProperty('published')) data.published = true;
} else {
data.published = false;
}

