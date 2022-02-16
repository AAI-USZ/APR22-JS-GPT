var moment = require('moment'),
db = hexo.db,
Schema = db.Schema,
config = hexo.config,
siteUrl = config.url + '/',
sourceDir = hexo.source_dir,
catDir = (config.category_dir || 'categories') + '/',
tagDir = (config.tag_dir || 'tags') + '/',
defaultCategory = config.default_category || 'uncategorized',
configLink = config.permalink || ':year/:month/:day/:title/';

var schemaPosts = new Schema({
title: String,
date: Date,
updated: Date,
categories: [Number],
