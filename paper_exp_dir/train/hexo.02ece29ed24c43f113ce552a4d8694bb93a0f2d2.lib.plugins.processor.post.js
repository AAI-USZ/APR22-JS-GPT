'use strict';

const common = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const pathFn = require('path');
const fs = require('hexo-fs');
const util = require('hexo-util');
const slugize = util.slugize;
const Pattern = util.Pattern;
const Permalink = util.Permalink;

const postDir = '_posts/';
const draftDir = '_drafts/';
let permalink;

const preservedKeys = {
title: true,
year: true,
month: true,
day: true,
i_month: true,
i_day: true
};

module.exports = ctx => {
function processPost(file) {
const Post = ctx.model('Post');
const path = file.params.path;
const doc = Post.findOne({source: file.path});
const config = ctx.config;
const timezone = config.timezone;
let categories, tags;

if (file.type === 'skip' && doc) {
return;
}

if (file.type === 'delete') {
if (doc) {
return doc.remove();
}

return;
}

return Promise.all([
file.stat(),
file.read()
]).spread((stats, content) => {
const data = yfm(content);
const info = parseFilename(config.new_post_name, path);
const keys = Object.keys(info);

data.source = file.path;
data.raw = content;
data.slug = info.title;

if (file.params.published) {
if (!data.hasOwnProperty('published')) data.published = true;
} else {
data.published = false;
}
