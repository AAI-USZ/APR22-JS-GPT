'use strict';

const { url_for } = require('hexo-util');

function listCategoriesHelper(categories, options) {
if (!options && (!categories || !Object.prototype.hasOwnProperty.call(categories, 'length'))) {
options = categories;
categories = this.site.categories;
}

if (!categories || !categories.length) return '';
options = options || {};
