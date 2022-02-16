'use strict';

const { Schema } = require('warehouse');
const moment = require('moment');
const { extname, join, sep } = require('path');
const Promise = require('bluebird');
const Moment = require('./types/moment');
const url_for = require('../plugins/helper/url_for');
const full_url_for = require('../plugins/helper/full_url_for');

function pickID(data) {
return data._id;
}

function removeEmptyTag(tags) {
return tags.filter(tag => tag != null && tag !== '').map(tag => `${tag}`);
}

module.exports = ctx => {
const Post = new Schema({
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
const path = ctx.execFilterSync('post_permalink', this, {context: ctx});
return typeof path === 'string' ? path : '';
});

Post.virtual('permalink').get(function() {
const { config } = ctx;
let partial_url = url_for.call(ctx, this.path);
if (config.pretty_urls.trailing_index === false) partial_url = partial_url.replace(/index\.html$/, '');
if (config.relative_link) partial_url = `/${partial_url}`;
return full_url_for.call(ctx, partial_url.replace(config.root, '/'));
});

Post.virtual('full_source').get(function() {
return join(ctx.source_dir, this.source || '');
});

Post.virtual('asset_dir').get(function() {
const src = this.full_source;
return src.substring(0, src.length - extname(src).length) + sep;
});

Post.virtual('tags').get(function() {
const PostTag = ctx.model('PostTag');
const Tag = ctx.model('Tag');

const ids = PostTag.find({post_id: this._id}, {lean: true}).map(item => item.tag_id);

return Tag.find({_id: {$in: ids}});
});

Post.method('setTags', function(tags) {
tags = removeEmptyTag(tags);

const PostTag = ctx.model('PostTag');
const Tag = ctx.model('Tag');
const id = this._id;
const existed = PostTag.find({post_id: id}, {lean: true}).map(pickID);

return Promise.map(tags, tag => {

const data = Tag.findOne({name: tag}, {lean: true});
if (data) return data;


return Tag.insert({name: tag}).catch(err => {

const data = Tag.findOne({name: tag}, {lean: true});

if (data) return data;
throw err;
});
}).map(tag => {

const ref = PostTag.findOne({post_id: id, tag_id: tag._id}, {lean: true});
if (ref) return ref;


return PostTag.insert({
post_id: id,
tag_id: tag._id
});
}).then(tags => {

const deleted = existed.filter(item => !tags.map(pickID).includes(item));
return deleted;
}).map(tag => PostTag.removeById(tag));
});

Post.virtual('categories').get(function() {
const PostCategory = ctx.model('PostCategory');
const Category = ctx.model('Category');

const ids = PostCategory.find({post_id: this._id}, {lean: true}).map(item => item.category_id);

return Category.find({_id: {$in: ids}});
});

Post.method('setCategories', function(cats) {

cats = cats.filter(cat => {
return Array.isArray(cat) || (cat != null && cat !== '');
}).map(cat => {
return Array.isArray(cat) ? removeEmptyTag(cat) : `${cat}`;
});

const PostCategory = ctx.model('PostCategory');
const Category = ctx.model('Category');
const id = this._id;
const allIds = [];
const existed = PostCategory.find({post_id: id}, {lean: true}).map(pickID);
const hasHierarchy = cats.filter(Array.isArray).length > 0;


const addHierarchy = catHierarchy => {
const parentIds = [];
if (!Array.isArray(catHierarchy)) catHierarchy = [catHierarchy];


return Promise.each(catHierarchy, (cat, i) => {

const data = Category.findOne({
name: cat,
parent: i ? parentIds[i - 1] : {$exists: false}
}, {lean: true});

if (data) {
allIds.push(data._id);
parentIds.push(data._id);
return data;
}


const obj = {name: cat};
if (i) obj.parent = parentIds[i - 1];

return Category.insert(obj).catch(err => {

const data = Category.findOne({
name: cat,
parent: i ? parentIds[i - 1] : {$exists: false}
}, {lean: true});

if (data) return data;
throw err;
}).then(data => {
allIds.push(data._id);
parentIds.push(data._id);
return data;
});
});
};

return (hasHierarchy ? Promise.each(cats, addHierarchy) : Promise.resolve(addHierarchy(cats))
).then(() => allIds).map(catId => {

const ref = PostCategory.findOne({post_id: id, category_id: catId}, {lean: true});
if (ref) return ref;


return PostCategory.insert({
post_id: id,
category_id: catId
});
}).then(postCats =>
existed.filter(item => !postCats.map(pickID).includes(item))).map(cat => PostCategory.removeById(cat));
});


Post.pre('remove', data => {
const PostTag = ctx.model('PostTag');
return PostTag.remove({post_id: data._id});
});


Post.pre('remove', data => {
const PostCategory = ctx.model('PostCategory');
return PostCategory.remove({post_id: data._id});
});


Post.pre('remove', data => {
const PostAsset = ctx.model('PostAsset');
return PostAsset.remove({post: data._id});
});

return Post;
};
