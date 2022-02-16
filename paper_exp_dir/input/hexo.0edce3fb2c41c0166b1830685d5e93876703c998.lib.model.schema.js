var moment = require('moment'),
config = hexo.config;

if (config.language) moment.lang(config.language);

var startsWith = function(str, text){
return str.substr(0, 1) === text;
};

var endsWith = function(str, text){
return str.substr(str.length - 1, 1) === text;
};

var genUrl = function(str){
return str + (endsWith(str, '/') ? '' : '/');
};

var siteUrl = genUrl(config.url),
sourceDir = hexo.source_dir,
catDir = genUrl(config.category_dir),
tagDir = genUrl(config.tag_dir),
defaultCat = config.default_category,
configLink = config.permalink;

module.exports = function(Schema){
var Post = new Schema({
id: Number,
title: String,
date: Date,
updated: Date,
categories: [Number],
tags: [Number],
comments: Boolean,
layout: {type: String, default: 'post'},
content: String,
excerpt: Number,
source: String,
slug: String,
ctime: Date,
mtime: Date,
