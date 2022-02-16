'use strict';

function listCategoriesHelper(categories, options){

if (!options && (!categories || !categories.hasOwnProperty('length'))){
options = categories;
categories = this.site.categories;
}

if (!categories || !categories.length) return '';
options = options || {};

var style = options.hasOwnProperty('style') ? options.style : 'list';
var showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
var className = options.class || 'category';
var depth = options.depth ? parseInt(options.depth, 10) : 0;
var orderby = options.orderby || 'name';
var order = options.order || 1;
var transform = options.transform;
var separator = options.hasOwnProperty('separator') ? options.separator : ', ';
var showCurrent = options.show_current || false;
var childrenIndicator = options.hasOwnProperty('children_indicator') ? options.children_indicator : false;
var result = '';
var self = this;

function prepareQuery(parent){
var query = {};

if (parent){
query.parent = parent;
