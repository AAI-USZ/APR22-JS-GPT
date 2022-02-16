'use strict';

function listTagsHelper(tags, options) {
if (!options && (!tags || !Object.prototype.hasOwnProperty.call(tags, 'length'))) {
options = tags;
tags = this.site.tags;
}

if (!tags || !tags.length) return '';
options = options || {};

const { style = 'list', transform, separator = ', ', suffix = '' } = options;
const showCount = Object.prototype.hasOwnProperty.call(options, 'show_count') ? options.show_count : true;
const classStyle = typeof style === 'string' ? `-${style}` : '';
let className, ulClass, liClass, aClass, countClass;
if (typeof options.class !== 'undefined') {
if (typeof options.class === 'string') {
className = options.class;
} else {
className = 'tag';
}

ulClass = options.class.ul || `${className}${classStyle}`;
liClass = options.class.li || `${className}${classStyle}-item`;
