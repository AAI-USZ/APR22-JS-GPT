'use strict';

const htmlTag = require('hexo-util').htmlTag;
const qs = require('querystring');

function mailToHelper(path, text, options = {}) {
if (Array.isArray(path)) path = path.join(',');
if (!text) text = path;

const attrs = {
href: `mailto:${path}`,
title: text
};
