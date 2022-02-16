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
