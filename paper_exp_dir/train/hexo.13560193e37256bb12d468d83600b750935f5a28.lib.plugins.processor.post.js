'use strict';

var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');
var fs = require('hexo-fs');
var util = require('hexo-util');
var slugize = util.slugize;
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
var config = this.config;
var timezone = config.timezone;
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
var info = parseFilename(config.new_post_name, path);
var keys = Object.keys(info);
var key;

data.source = file.path;
data.raw = content;
data.slug = info.title;

if (file.params.published){
if (!data.hasOwnProperty('published')) data.published = true;
} else {
data.published = false;
}

for (var i = 0, len = keys.length; i < len; i++){
key = keys[i];
if (!preservedKeys[key]) data[key] = info[key];
}

if (data.date){
data.date = common.toDate(data.date);
} else if (info && info.year && (info.month || info.i_month) && (info.day || info.i_day)){
data.date = new Date(
info.year,
parseInt(info.month || info.i_month, 10) - 1,
parseInt(info.day || info.i_day, 10)
);
}

if (data.date){
if (timezone) data.date = common.timezone(data.date, timezone);
} else {
data.date = stats.ctime;
}

data.updated = common.toDate(data.updated);

if (data.updated){
if (timezone) data.updated = common.timezone(data.updated, timezone);
} else {
data.updated = stats.mtime;
}

if (data.category && !data.categories){
data.categories = data.category;
delete data.category;
}

if (data.tag && !data.tags){
data.tags = data.tag;
delete data.tag;
}

categories = data.categories || [];
tags = data.tags || [];

if (!Array.isArray(categories)) categories = [categories];
if (!Array.isArray(tags)) tags = [tags];

if (data.photo && !data.photos){
data.photos = data.photo;
delete data.photo;
}

if (data.photos && !Array.isArray(data.photos)){
data.photos = [data.photos];
}

if (data.link && !data.title){
data.title = data.link.replace(/^https?:\/\/|\/$/g, '');
}

if (data.permalink){
data.slug = data.permalink;
delete data.permalink;
}

if (doc){
return doc.replace(data);
} else {
return Post.insert(data);
}
