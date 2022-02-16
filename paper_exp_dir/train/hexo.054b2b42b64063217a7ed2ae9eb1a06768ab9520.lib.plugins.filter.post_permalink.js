'use strict';

var _ = require('lodash');
var util = require('hexo-util');
var pathFn = require('path');
var Permalink = util.Permalink;
var permalink;

function postPermalinkFilter(data){

var config = this.config;
var meta = {
id: data.id || data._id,
title: data.slug,
name: pathFn.basename(data.slug),
post_title: util.slugize(data.title, {transform: 1}),
year: data.date.format('YYYY'),
month: data.date.format('MM'),
day: data.date.format('DD'),
i_month: data.date.format('M'),
i_day: data.date.format('D')
};

if (!permalink || permalink.rule !== config.permalink){
permalink = new Permalink(config.permalink);
