'use strict';

const pathFn = require('path');
const moment = require('moment');
const defaults = require('lodash/defaults');
const Promise = require('bluebird');
const util = require('hexo-util');
const fs = require('hexo-fs');
const Permalink = util.Permalink;
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
const draftDir = pathFn.join(sourceDir, '_drafts');
const postDir = pathFn.join(sourceDir, '_posts');
const config = this.config;
const newPostName = config.new_post_name;
const permalinkDefaults = config.permalink_defaults;
const path = data.path;
const layout = data.layout;
const slug = data.slug;

if (!permalink || permalink.rule !== newPostName) {
permalink = new Permalink(newPostName);
}

let target = '';

if (path) {
switch (layout) {
case 'page':
