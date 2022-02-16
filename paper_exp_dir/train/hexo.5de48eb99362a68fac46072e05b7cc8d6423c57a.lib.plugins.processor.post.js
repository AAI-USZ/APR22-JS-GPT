'use strict';

const { toDate, timezone, isExcludedFile, isTmpFile, isHiddenFile, isMatch } = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const { extname, join } = require('path');
const { stat, listDir } = require('hexo-fs');
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
i_day: true,
hash: true
};

module.exports = ctx => {
function processPost(file) {
const Post = ctx.model('Post');
const { path } = file.params;
const doc = Post.findOne({source: file.path});
const { config } = ctx;
const { timezone: timezoneCfg, use_date_for_updated } = config;
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
data.date = toDate(data.date);
} else if (info && info.year && (info.month || info.i_month) && (info.day || info.i_day)) {
data.date = new Date(
info.year,
parseInt(info.month || info.i_month, 10) - 1,
parseInt(info.day || info.i_day, 10)
);
}

if (data.date) {
if (timezoneCfg) data.date = timezone(data.date, timezoneCfg);
} else {
data.date = stats.birthtime;
}

data.updated = toDate(data.updated);

if (data.updated) {
if (timezoneCfg) data.updated = timezone(data.updated, timezoneCfg);
} else if (use_date_for_updated) {
data.updated = data.date;
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

if (data.permalink) {
data.__permalink = data.permalink;
delete data.permalink;
}



const doc = Post.findOne({source: file.path});

if (doc) {
return doc.replace(data);
}

return Post.insert(data);
}).then(doc => Promise.all([
doc.setCategories(categories),
doc.setTags(tags),
scanAssetDir(doc)
]));
}

function scanAssetDir(post) {
if (!ctx.config.post_asset_folder) return;

const assetDir = post.asset_dir;
const baseDir = ctx.base_dir;
const baseDirLength = baseDir.length;
const PostAsset = ctx.model('PostAsset');

return stat(assetDir).then(stats => {
if (!stats.isDirectory()) return [];

return listDir(assetDir);
}).catch(err => {
if (err && err.code === 'ENOENT') return [];
throw err;
}).filter(item => !isExcludedFile(item, ctx.config)).map(item => {
const id = join(assetDir, item).substring(baseDirLength).replace(/\\/g, '/');
const asset = PostAsset.findById(id);

if (post.published == false) {
if (asset) {
return asset.remove()
}
return;
}

if (asset) return undefined;

