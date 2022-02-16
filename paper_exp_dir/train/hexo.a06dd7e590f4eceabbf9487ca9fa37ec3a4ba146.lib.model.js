var moment = require('moment'),
Query = require('./db/query'),
db = hexo.db,
Schema = db.Schema,
config = hexo.config,
siteUrl = config.url + '/';

var schemaPosts = new Schema({
title: String,
date: Date,
