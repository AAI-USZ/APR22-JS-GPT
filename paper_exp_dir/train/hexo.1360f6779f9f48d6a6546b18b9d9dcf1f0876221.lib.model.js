var moment = require('moment'),
db = hexo.db,
Schema = db.Schema,
config = hexo.config,
siteUrl = config.url + '/';

var schemaPosts = new Schema({
title: String,
date: Date,
updated: Date,
categories: [new Schema.Types.Reference('categories')],
tags: [new Schema.Types.Reference('tags')],
comments: Boolean,
layout: {type: String, default: 'post'},
content: String,
excerpt: String,
source: String,
path: String
});

var schemaPages = new Schema({
title: String,
date: Date,
updated: Date,
comments: Boolean,
layout: {type: String, default: 'page'},
content: String,
source: String,
path: String
});

var schemaCats = new Schema({
name: String,
path: String,
posts: [new Schema.Types.Reference('posts')]
});

var schemaAssets = new Schema({
source: String,
mtime: Date
});

var dateGetter = function(){
return moment(this.date);
};

var updatedGetter = function(){
