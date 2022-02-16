'use strict';

function listCategoriesHelper(categories, options) {
if (!options && (!categories || !categories.hasOwnProperty('length'))) {
options = categories;
categories = this.site.categories;
}

if (!categories || !categories.length) return '';
options = options || {};

const style = options.hasOwnProperty('style') ? options.style : 'list';
const showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
const className = options.class || 'category';
const depth = options.depth ? parseInt(options.depth, 10) : 0;
const orderby = options.orderby || 'name';
const order = options.order || 1;
const transform = options.transform;
const separator = options.hasOwnProperty('separator') ? options.separator : ', ';
const showCurrent = options.show_current || false;
const suffix = options.suffix || '';
const childrenIndicator = options.hasOwnProperty('children_indicator') ? options.children_indicator : false;
