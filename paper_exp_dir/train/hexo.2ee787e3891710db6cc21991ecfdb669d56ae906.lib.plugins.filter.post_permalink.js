'use strict';

const _ = require('lodash');
const util = require('hexo-util');
const pathFn = require('path');
const Permalink = util.Permalink;
let permalink;

function postPermalinkFilter(data) {
const config = this.config;
const meta = {
id: data.id || data._id,
title: data.slug,
name: typeof data.slug === 'string' ? pathFn.basename(data.slug) : '',
post_title: util.slugize(data.title, {transform: 1}),
year: data.date.format('YYYY'),
month: data.date.format('MM'),
day: data.date.format('DD'),
i_month: data.date.format('M'),
i_day: data.date.format('D')
};

if (!permalink || permalink.rule !== config.permalink) {
permalink = new Permalink(config.permalink);
}

const categories = data.categories;

if (categories.length) {
meta.category = categories.last().slug;
} else {
meta.category = config.default_category;
}

const keys = Object.keys(data);
let key = '';
