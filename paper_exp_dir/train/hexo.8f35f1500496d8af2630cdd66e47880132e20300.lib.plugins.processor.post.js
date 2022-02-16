'use strict';

var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');
var fs = require('hexo-fs');
var _ = require('lodash');
var util = require('hexo-util');
var slugize = util.slugize;
var Pattern = util.Pattern;
var Permalink = util.Permalink;

var postDir = '_posts/';
var draftDir = '_drafts/';
var permalink;

var preservedKeys = {
title: true,
year: true,
month: true,
day: true,
i_month: true,
i_day: true
};

module.exports = function(ctx) {
function processPost(file) {
var Post = ctx.model('Post');
var path = file.params.path;
var doc = Post.findOne({source: file.path});
var config = ctx.config;
var timezone = config.timezone;
var categories, tags;

if (file.type === 'skip' && doc) {
return;
}

if (file.type === 'delete') {
if (doc) {
return doc.remove();
}

return;
