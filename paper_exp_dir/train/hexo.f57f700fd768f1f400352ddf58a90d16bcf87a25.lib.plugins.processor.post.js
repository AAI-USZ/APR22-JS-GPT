'use strict';

const common = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const { extname, join } = require('path');
const fs = require('hexo-fs');
const { slugize, Pattern, Permalink } = require('hexo-util');

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
const { path } = file.params;
const doc = Post.findOne({source: file.path});
const { config } = ctx;
const { timezone } = config;
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
if (!Object.prototype.hasOwnProperty.call(data, 'published')) data.published = true;
} else {
data.published = false;
}

for (let i = 0, len = keys.length; i < len; i++) {
const key = keys[i];
if (!preservedKeys[key]) data[key] = info[key];
}

if (data.date) {
data.date = common.toDate(data.date);
} else if (info && info.year && (info.month || info.i_month) && (info.day || info.i_day)) {
data.date = new Date(
info.year,
parseInt(info.month || info.i_month, 10) - 1,
parseInt(info.day || info.i_day, 10)
);
}

if (data.date) {
if (timezone) data.date = common.timezone(data.date, timezone);
} else {
data.date = stats.birthtime;
}

data.updated = common.toDate(data.updated);

if (data.updated) {
if (timezone) data.updated = common.timezone(data.updated, timezone);
} else {
data.updated = stats.mtime;
}

if (data.category && !data.categories) {
data.categories = data.category;
delete data.category;
}

if (data.tag && !data.tags) {
data.tags = data.tag;
delete data.tag;
}

categories = data.categories || [];
tags = data.tags || [];

if (!Array.isArray(categories)) categories = [categories];
if (!Array.isArray(tags)) tags = [tags];

if (data.photo && !data.photos) {
data.photos = data.photo;
delete data.photo;
}

if (data.photos && !Array.isArray(data.photos)) {
data.photos = [data.photos];
}

if (data.link && !data.title) {
data.title = data.link.replace(/^https?:\/\/|\/$/g, '');
}

if (!data.title) {
data.title = data.slug;
}

if (data.permalink) {
data.slug = data.permalink;
delete data.permalink;
}



