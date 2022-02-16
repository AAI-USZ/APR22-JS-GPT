'use strict';

const { join, extname } = require('path');
const moment = require('moment');
const defaults = require('lodash/defaults');
const Promise = require('bluebird');
const { Permalink } = require('hexo-util');
const fs = require('hexo-fs');
let permalink;

const reservedKeys = {
year: true,
month: true,
i_month: true,
day: true,
i_day: true,
title: true
};

function newPostPathFilter(data = {}, replace) {
const sourceDir = this.source_dir;
const draftDir = join(sourceDir, '_drafts');
const postDir = join(sourceDir, '_posts');
const { config } = this;
const newPostName = config.new_post_name;
const permalinkDefaults = config.permalink_defaults;
const { path, layout, slug } = data;
let target = '';

if (!permalink || permalink.rule !== newPostName) {
permalink = new Permalink(newPostName);
}

if (path) {
switch (layout) {
case 'page':
