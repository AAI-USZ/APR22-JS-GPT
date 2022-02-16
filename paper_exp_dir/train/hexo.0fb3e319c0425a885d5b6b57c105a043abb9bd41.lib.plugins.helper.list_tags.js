'use strict';

const { url_for } = require('hexo-util');

function listTagsHelper(tags, options) {
if (!options && (!tags || !Object.prototype.hasOwnProperty.call(tags, 'length'))) {
options = tags;
tags = this.site.tags;
}

if (!tags || !tags.length) return '';
options = options || {};
