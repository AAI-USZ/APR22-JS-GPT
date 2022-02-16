var _ = require('lodash'),
fs = require('graceful-fs'),
Post = hexo.model('Post'),
create = hexo.create,
process = hexo.process,
sourceDir = hexo.source_dir;

exports.index = function(req, res, next){
var query = _.defaults(req.query, {
page: 1,
limit: 20
});

var posts = Post.sort('date', -1),
arr = [];



posts.forEach(function(post){
arr.push({
id: post._id,
title: post.title,
date: post.date.valueOf(),
updated: post.updated.valueOf()
});
});

res.json(arr);
};

exports.create = function(req, res, next){
create({title: req.body.title, layout: 'post'}, function(err, target){
if (err) return next(err);
