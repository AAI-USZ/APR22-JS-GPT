var moment = require('moment'),
db = hexo.db,
Schema = db.Schema,
config = hexo.config,
siteUrl = config.url + '/';

var schemaPosts = new Schema({
title: String,
date: Date,
updated: Date,
categories: [Number],
