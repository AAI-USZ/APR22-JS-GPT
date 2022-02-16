'use strict';

const { Permalink, slugize } = require('hexo-util');
const { basename } = require('path');
let permalink;

function postPermalinkFilter(data) {
const { config } = this;
const { id, _id, slug, title, date } = data;
const meta = {
id: id || _id,
title: slug,
name: typeof slug === 'string' ? basename(slug) : '',
post_title: slugize(title, {transform: 1}),
year: date.format('YYYY'),
month: date.format('MM'),
day: date.format('DD'),
hour: date.format('HH'),
