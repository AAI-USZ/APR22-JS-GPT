'use strict';

const Color = require('../../../node_modules/hexo-util/lib/color');

function tagcloudHelper(tags, options) {
if (!options && (!tags || !Object.prototype.hasOwnProperty.call(tags, 'length'))) {
options = tags;
tags = this.site.tags;
}

if (!tags || !tags.length) return '';
options = options || {};
