'use strict';

const { createSha1Hash, Permalink, slugize } = require('hexo-util');
const { basename } = require('path');
let permalink;

function postPermalinkFilter(data) {
const { config } = this;
const { id, _id, slug, title, date } = data;
const hash = slug && date
? createSha1Hash().update(slug + date.unix().toString()).digest('hex').slice(0, 12)
: null;
const meta = {
id: id || _id,
title: slug,
name: typeof slug === 'string' ? basename(slug) : '',
post_title: slugize(title, {transform: 1}),
year: date.format('YYYY'),
month: date.format('MM'),
day: date.format('DD'),
hour: date.format('HH'),
minute: date.format('mm'),
second: date.format('ss'),
i_month: date.format('M'),
i_day: date.format('D'),
hash
};

if (!permalink || permalink.rule !== config.permalink) {
permalink = new Permalink(config.permalink);
}

