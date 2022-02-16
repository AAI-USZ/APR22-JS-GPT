'use strict';

const { htmlTag } = require('hexo-util');

function linkToHelper(path, text, options = {}) {
if (typeof options === 'boolean') options = {external: options};

if (!text) text = path.replace(/^https?:\/\/|\/$/g, '');

const attrs = {
href: this.url_for(path),
title: text
};

const keys = Object.keys(options);
