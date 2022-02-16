'use strict';

const { Color } = require('hexo-util');

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
const color = options.color;
const className = options.class;
const level = options.level || 10;
const { transform } = options;
const separator = options.separator || ' ';
const result = [];
let startColor, endColor;

if (color) {
if (!options.start_color) throw new TypeError('start_color is required!');
if (!options.end_color) throw new TypeError('end_color is required!');

