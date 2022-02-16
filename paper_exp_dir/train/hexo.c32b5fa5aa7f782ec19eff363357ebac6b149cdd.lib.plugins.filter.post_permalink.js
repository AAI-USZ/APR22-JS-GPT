'use strict';

const defaults = require('lodash/defaults');
const { Permalink, slugize } = require('hexo-util');
const { basename } = require('path');
let permalink;

function postPermalinkFilter(data) {
const { config } = this;
const meta = {
id: data.id || data._id,
title: data.slug,
name: typeof data.slug === 'string' ? basename(data.slug) : '',
post_title: slugize(data.title, {transform: 1}),
year: data.date.format('YYYY'),
month: data.date.format('MM'),
day: data.date.format('DD'),
hour: data.date.format('HH'),
minute: data.date.format('mm'),
i_month: data.date.format('M'),
i_day: data.date.format('D')
};

if (!permalink || permalink.rule !== config.permalink) {
permalink = new Permalink(config.permalink);
}

const { categories } = data;
