var _ = require('lodash'),
moment = require('moment');

exports.list_categories = function(categories, options){
if (!options){
options = categories;
categories = this.site.categories;
}

if (!categories.length) return '';

options = _.extend({
orderby: 'name',
order: 1,
show_count: true,
style: 'list',
separator: ', ',
depth: 0,
class: 'category'
}, options);

var style = options.style,
showCount = options.show_count,
className = options.class,
depth = parseInt(options.depth, 10),
orderby = options.orderby,
order = options.order,
root = this.config.root,
result = '',
arr = [],
condition = {};

if (style === 'list'){
result = '<ul class="' + className + '-list">';
} else {
