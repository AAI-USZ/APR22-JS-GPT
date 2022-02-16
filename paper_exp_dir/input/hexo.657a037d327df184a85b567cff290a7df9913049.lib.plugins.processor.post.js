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
