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
