'use strict';

const { Schema } = require('warehouse');
const moment = require('moment');
const { extname, join, sep } = require('path');
const Promise = require('bluebird');
const Moment = require('./types/moment');
const { full_url_for } = require('hexo-util');

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
