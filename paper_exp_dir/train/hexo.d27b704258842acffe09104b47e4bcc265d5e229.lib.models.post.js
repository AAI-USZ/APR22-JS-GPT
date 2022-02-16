'use strict';

var Schema = require('warehouse').Schema;
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var Moment = require('./types/moment');

function pickID(data) {
return data._id;
}

function removeEmptyTag(tags) {
return tags.filter(function(tag) {
return tag != null && tag !== '';
}).map(function(tag) {
return tag + '';
});
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
content: {type: String},
excerpt: {type: String},
more: {type: String}
});

Post.virtual('path').get(function() {
var path = ctx.execFilterSync('post_permalink', this, {context: ctx});
return typeof path === 'string' ? path : '';
});

Post.virtual('permalink').get(function() {
var self = _.assign({}, ctx.extend.helper.list(), ctx);
var config = ctx.config;
var partial_url = self.url_for(this.path);
return config.url + _.replace(partial_url, config.root, '/');
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

var ids = PostTag.find({post_id: this._id}, {lean: true}).map(function(item) {
return item.tag_id;
});

return Tag.find({_id: {$in: ids}});
});

Post.method('setTags', function(tags) {
tags = removeEmptyTag(tags);

var PostTag = ctx.model('PostTag');
var Tag = ctx.model('Tag');
var id = this._id;
var existed = PostTag.find({post_id: id}, {lean: true}).map(pickID);

return Promise.map(tags, function(tag) {

var data = Tag.findOne({name: tag}, {lean: true});
if (data) return data;


return Tag.insert({name: tag}).catch(function(err) {

var data = Tag.findOne({name: tag}, {lean: true});

if (data) return data;
throw err;
});
}).map(function(tag) {

var ref = PostTag.findOne({post_id: id, tag_id: tag._id}, {lean: true});
if (ref) return ref;


return PostTag.insert({
post_id: id,
tag_id: tag._id
});
}).then(function(tags) {

var deleted = _.difference(existed, tags.map(pickID));
return deleted;
}).map(function(tag) {
return PostTag.removeById(tag);
});
});

Post.virtual('categories').get(function() {
var PostCategory = ctx.model('PostCategory');
var Category = ctx.model('Category');

var ids = PostCategory.find({post_id: this._id}, {lean: true}).map(function(item) {
return item.category_id;
});

return Category.find({_id: {$in: ids}});
});

Post.method('setCategories', function(cats) {

cats = cats.filter(function(cat) {
return Array.isArray(cat) ? true : cat != null && cat !== '';
}).map(function(cat) {
return Array.isArray(cat) ? removeEmptyTag(cat) : cat + '';
});

var PostCategory = ctx.model('PostCategory');
var Category = ctx.model('Category');
var id = this._id;
