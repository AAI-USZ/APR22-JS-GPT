var moment = require('moment'),
db = hexo.db,
Schema = db.Schema,
config = hexo.config,
siteUrl = config.url + '/',
sourceDir = hexo.source_dir,
catDir = config.category_dir + '/',
tagDir = config.tag_dir + '/',
defaultCategory = config.default_category ,
configLink = config.permalink;

if (config.language) moment.lang(config.language.toLowerCase());

var schemaPosts = new Schema({
id: Number,
title: String,
date: Date,
updated: Date,
categories: [Number],
tags: [Number],
comments: Boolean,
