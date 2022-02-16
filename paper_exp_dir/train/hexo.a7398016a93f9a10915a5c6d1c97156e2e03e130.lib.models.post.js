var Schema = require('warehouse').Schema;
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');

var Moment = require('./types/moment');
var common = require('./common');

module.exports = function(ctx){
var swig = ctx.extend.tag.swig;

var Post = new Schema({
id: Number,
title: {type: String, default: ''},
date: {type: Moment, default: moment},
updated: {type: Moment, default: moment},
comments: {type: Boolean, default: true},
layout: {type: String, default: 'post'},
_content: {type: String, default: ''},
source: {type: String, required: true},
slug: {type: String, required: true},
photos: [String],
link: {type: String, default: ''},
raw: {type: String, default: ''},
published: {type: Boolean, default: true}
});

Post.virtual('path').get(function(){
var path = ctx.extend.filter.execSync('post_permalink', this, {context: ctx});
return typeof path === 'string' ? path : '';
});

Post.virtual('permalink').get(function(){
return ctx.config.url + '/' + this.path;
});

Post.virtual('full_source').get(function(){
return pathFn.join(ctx.source_dir, this.source || '');
});

Post.virtual('asset_dir').get(function(){
var src = this.full_source;
return src.substring(0, src.length - pathFn.extname(src).length) + pathFn.sep;
});

Post.virtual('content').get(function(){
return common.renderContent(swig, this);
});

Post.virtual('excerpt').get(function(){
return common.getExcerpt(this.content);
});

Post.virtual('more').get(function(){
return common.getMore(this.content);
});

Post.virtual('tags').get(function(){
var PostTag = ctx.model('PostTag');
var Tag = ctx.model('Tag');

var ids = PostTag.find({post_id: this._id}).map(function(item){
return item.tag_id;
});

return Tag.find({_id: {$in: ids}});
});

Post.method('setTags', function(tags){
var PostTag = ctx.model('PostTag');
var Tag = ctx.model('Tag');
var id = this._id;

return Promise.map(tags, function(tag){

var data = Tag.findOne({name: tag});
if (data) return data;


return Tag.insert({name: tag});
}).each(function(tag){

var ref = PostTag.findOne({post_id: id, tag_id: tag._id});
if (ref) return ref;


return PostTag.insert({
post_id: id,
tag_id: tag._id
});
});
});

Post.virtual('categories').get(function(){
var PostCategory = ctx.model('PostCategory');
var Category = ctx.model('Category');

var ids = PostCategory.find({post_id: this._id}).map(function(item){
return item.category_id;
});

return Category.find({_id: {$in: ids}});
});

Post.method('setCategories', function(cats){
var PostCategory = ctx.model('PostCategory');
var Category = ctx.model('Category');
var id = this._id;
var arr = [];



return Promise.each(cats, function(cat, i){

var data = Category.findOne({
name: cat,
parent: i ? cats[i - 1] : {$exists: false}
});

if (data){
arr.push(data._id);
return data;
}


var obj = {name: cat};
if (i) obj.parent = arr[i - 1];

return Category.insert(obj).then(function(data){
arr.push(data._id);
return data;
});
}).each(function(){


var cat = arr[arguments[1]];


var ref = PostCategory.findOne({post_id: id, tag_id: cat});
if (ref) return ref;


return PostCategory.insert({
post_id: id,
category_id: cat
});
});
});


Post.pre('remove', function(data){
var PostTag = ctx.model('PostTag');
return PostTag.remove({post_id: data._id});
});


Post.pre('remove', function(data){
var PostCategory = ctx.model('PostCategory');
return PostCategory.remove({post_id: data._id});
});


Post.pre('remove', function(data){
var PostAsset = ctx.model('PostAsset');
return PostAsset.remove({post: data._id});
});

return Post;
};
