'use strict';

function listCategoriesHelper(categories, options) {
if (!options && (!categories || !categories.hasOwnProperty('length'))) {
options = categories;
categories = this.site.categories;
}

if (!categories || !categories.length) return '';
options = options || {};

const { style = 'list', transform, separator = ', ', suffix = '' } = options;
const showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
const className = options.class || 'category';
const depth = options.depth ? parseInt(options.depth, 10) : 0;
const orderby = options.orderby || 'name';
const order = options.order || 1;
const showCurrent = options.show_current || false;
const childrenIndicator = options.hasOwnProperty('children_indicator') ? options.children_indicator : false;
let result = '';
const self = this;

function prepareQuery(parent) {
const query = {};

if (parent) {
query.parent = parent;
