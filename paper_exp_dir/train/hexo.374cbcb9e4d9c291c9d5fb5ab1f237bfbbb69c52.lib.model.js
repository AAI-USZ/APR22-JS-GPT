var moment = require('moment'),
db = hexo.db,
Schema = db.Schema,
config = hexo.config,
siteUrl = config.url + '/',
sourceDir = hexo.source_dir,
tagDir = (config.tag_dir || 'tags') + '/';

var schemaPosts = new Schema({
title: String,
date: Date,
updated: Date,
categories: [Number],
tags: [Number],
comments: Boolean,
