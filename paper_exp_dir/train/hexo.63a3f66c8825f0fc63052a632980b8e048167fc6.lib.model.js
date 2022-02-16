var moment = require('moment'),
db = hexo.db,
Schema = db.Schema,
config = hexo.config,
siteUrl = config.url + '/',
sourceDir = hexo.source_dir;

var schemaPosts = new Schema({
title: String,
date: Date,
updated: Date,
categories: [Number],
tags: [Number],
comments: Boolean,
layout: {type: String, default: 'post'},
content: String,
excerpt: String,
source: String,
path: String,
ctime: Date,
mtime: Date
});

var schemaPages = new Schema({
title: String,
date: Date,
updated: Date,
