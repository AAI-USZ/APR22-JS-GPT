'use strict';

const { Schema } = require('warehouse');
const moment = require('moment');
const { extname, join, sep } = require('path');
const Promise = require('bluebird');
const Moment = require('./types/moment');

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
const self = Object.assign({}, ctx.extend.helper.list(), ctx);
const { config } = ctx;
let partial_url = self.url_for(this.path);
if (config.relative_link) partial_url = `/${partial_url}`;
if (config.pretty_urls.trailing_index === false) partial_url = partial_url.replace(/index\.html$/, '');
return config.url + partial_url.replace(config.root, '/');
});

Post.virtual('full_source').get(function() {
return join(ctx.source_dir, this.source || '');
});

Post.virtual('asset_dir').get(function() {
const src = this.full_source;
