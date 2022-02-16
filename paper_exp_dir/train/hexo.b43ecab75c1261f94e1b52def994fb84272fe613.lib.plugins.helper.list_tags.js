'use strict';

function listTagsHelper(tags, options) {
if (!options && (!tags || !tags.hasOwnProperty('length'))) {
options = tags;
tags = this.site.tags;
}

if (!tags || !tags.length) return '';
options = options || {};

var style = options.hasOwnProperty('style') ? options.style : 'list';
var showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
var className = options.class || 'tag';
var orderby = options.orderby || 'name';
var order = options.order || 1;
var transform = options.transform;
var suffix = options.suffix || '';
var separator = options.hasOwnProperty('separator') ? options.separator : ', ';
var result = '';
var self = this;


tags = tags.sort(orderby, order);


tags = tags.filter(function(tag) {
return tag.length;
});
