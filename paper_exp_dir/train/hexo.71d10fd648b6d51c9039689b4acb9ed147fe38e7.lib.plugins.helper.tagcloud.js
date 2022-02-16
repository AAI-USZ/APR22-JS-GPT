'use strict';

const Color = require('hexo-util').Color;

function tagcloudHelper(tags, options) {
if (!options && (!tags || !Object.prototype.hasOwnProperty.call(tags, 'length'))) {
options = tags;
tags = this.site.tags;
}

if (!tags || !tags.length) return '';
options = options || {};

const min = options.min_font || 10;
const max = options.max_font || 20;
const orderby = options.orderby || 'name';
const order = options.order || 1;
const unit = options.unit || 'px';
let color = options.color;
const { transform } = options;
const separator = options.separator || ' ';
const result = [];
let startColor, endColor;

if (color) {
startColor = new Color(options.start_color);
endColor = new Color(options.end_color);

if (!startColor || !endColor) color = false;
}


if (orderby === 'random' || orderby === 'rand') {
tags = tags.random();
} else {
tags = tags.sort(orderby, order);
}


if (options.amount) {
tags = tags.limit(options.amount);
}

const sizes = [];

tags.sort('length').forEach(tag => {
const { length } = tag;
if (sizes.includes(length)) return;

