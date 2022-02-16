'use strict';

function listTagsHelper(tags, options) {
if (!options && (!tags || !tags.hasOwnProperty('length'))) {
options = tags;
tags = this.site.tags;
}

if (!tags || !tags.length) return '';
options = options || {};

const { style = 'list', transform, separator = ', ', suffix = '' } = options;
const showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
const className = options.class || 'tag';
const orderby = options.orderby || 'name';
const order = options.order || 1;
let result = '';
const self = this;


tags = tags.sort(orderby, order);


tags = tags.filter(tag => tag.length);


if (options.amount) tags = tags.limit(options.amount);

if (style === 'list') {
result += `<ul class="${className}-list">`;
