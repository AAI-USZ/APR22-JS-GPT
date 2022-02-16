'use strict';

const { createSha1Hash, Permalink, slugize } = require('hexo-util');
const { basename } = require('path');
let permalink;

function postPermalinkFilter(data) {
const { config } = this;
const { id, _id, slug, title, date, __permalink } = data;

if (__permalink) {
if (!__permalink.startsWith('/')) return `/${__permalink}`;
return __permalink;
}

const hash = slug && date
? createSha1Hash().update(slug + date.unix().toString()).digest('hex').slice(0, 12)
: null;
