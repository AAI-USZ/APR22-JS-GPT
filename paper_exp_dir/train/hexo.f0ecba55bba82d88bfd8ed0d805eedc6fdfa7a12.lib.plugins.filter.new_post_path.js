'use strict';

const { join, extname } = require('path');
const moment = require('moment');
const Promise = require('bluebird');
const { createSha1Hash, Permalink } = require('hexo-util');
const fs = require('hexo-fs');
let permalink;

const reservedKeys = {
year: true,
month: true,
i_month: true,
day: true,
i_day: true,
title: true,
hash: true
};

function newPostPathFilter(data = {}, replace) {
const sourceDir = this.source_dir;
const draftDir = join(sourceDir, '_drafts');
const postDir = join(sourceDir, '_posts');
const { config } = this;
