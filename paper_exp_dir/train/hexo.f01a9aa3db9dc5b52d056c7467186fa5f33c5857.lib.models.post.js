'use strict';

var Schema = require('warehouse').Schema;
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');

var Moment = require('./types/moment');
var CacheString = require('./types/cachestring');

function pickID(data) {
return data._id;
}

module.exports = function(ctx) {
var Post = new Schema({
id: String,
title: {type: String, default: ''},
date: {
type: Moment,
default: moment,
language: ctx.config.languages,
timezone: ctx.config.timezone
},
updated: {
type: Moment,
default: moment,
language: ctx.config.languages,
timezone: ctx.config.timezone
},
comments: {type: Boolean, default: true},
layout: {type: String, default: 'post'},
_content: {type: String, default: ''},
source: {type: String, required: true},
slug: {type: String, required: true},
photos: [String],
link: {type: String, default: ''},
raw: {type: String, default: ''},
published: {type: Boolean, default: true},
content: {type: CacheString, default: ''},
excerpt: {type: CacheString, default: ''},
more: {type: CacheString, default: ''}
});

Post.virtual('path').get(function() {
var path = ctx.execFilterSync('post_permalink', this, {context: ctx});
return typeof path === 'string' ? path : '';
});

Post.virtual('permalink').get(function() {
return ctx.config.url + '/' + this.path;
});

Post.virtual('full_source').get(function() {
return pathFn.join(ctx.source_dir, this.source || '');
});

Post.virtual('asset_dir').get(function() {
var src = this.full_source;
return src.substring(0, src.length - pathFn.extname(src).length) + pathFn.sep;
});

Post.virtual('tags').get(function() {
var PostTag = ctx.model('PostTag');
var Tag = ctx.model('Tag');

var ids = PostTag.find({post_id: this._id}).map(function(item) {
return item.tag_id;
});

return Tag.find({_id: {$in: ids}}).sort('name');
});

Post.method('setTags', function(tags) {
var PostTag = ctx.model('PostTag');
var Tag = ctx.model('Tag');
var id = this._id;
var existed = PostTag.find({post_id: id}).map(pickID);

return Promise.map(tags, function(tag) {
