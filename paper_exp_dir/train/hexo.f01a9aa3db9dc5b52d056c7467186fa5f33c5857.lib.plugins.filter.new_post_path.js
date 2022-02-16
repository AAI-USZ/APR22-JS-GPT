'use strict';

var pathFn = require('path');
var moment = require('moment');
var _ = require('lodash');
var Promise = require('bluebird');
var util = require('hexo-util');
var fs = require('hexo-fs');
var Permalink = util.Permalink;
var permalink;

var reservedKeys = {
year: true,
month: true,
i_month: true,
day: true,
i_day: true,
title: true
};

function newPostPathFilter(data, replace) {
data = data || {};

var sourceDir = this.source_dir;
var draftDir = pathFn.join(sourceDir, '_drafts');
var postDir = pathFn.join(sourceDir, '_posts');
var config = this.config;
var newPostName = config.new_post_name;
var permalinkDefaults = config.permalink_defaults;
var path = data.path;
