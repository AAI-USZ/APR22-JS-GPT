'use strict';

function listCategoriesHelper(categories, options) {
if (!options && (!categories || !categories.hasOwnProperty('length'))) {
options = categories;
categories = this.site.categories;
}

if (!categories || !categories.length) return '';
options = options || {};

var style = options.hasOwnProperty('style') ? options.style : 'list';
