'use strict';

const { url_for } = require('hexo-util');

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
let className, ulClass, liClass, aClass, labelClass, countClass, labelSpan;
if (typeof options.class !== 'undefined') {
if (typeof options.class === 'string') {
className = options.class;
} else {
className = 'tag';
}

ulClass = options.class.ul || `${className}${classStyle}`;
liClass = options.class.li || `${className}${classStyle}-item`;
aClass = options.class.a || `${className}${classStyle}-link`;
labelClass = options.class.label || `${className}${classStyle}-label`;
countClass = options.class.count || `${className}${classStyle}-count`;

labelSpan = Object.prototype.hasOwnProperty.call(options.class, 'label');
} else {
className = 'tag';
ulClass = `${className}${classStyle}`;
liClass = `${className}${classStyle}-item`;
aClass = `${className}${classStyle}-link`;
