var _ = require('lodash'),
moment = require('moment');

exports.list_categories = function(categories, options){
if (!options){
options = categories;
categories = this.site.categories;
}

if (!categories.length) return '';

var options = _.extend({
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
depth = options.depth,
orderby = options.orderby,
order = options.order,
root = this.config.root;

if (style === 'list'){
var result = '<ul class="' + className + '-list">';
} else {
var result = '';
}

var arr = [];

var list = function(i, parent){
var html = '';

if (depth == -1){
var condition = {};
} else {
var condition = {
parent: parent ? parent : {$exist: false}
};
}

categories.find(condition).sort(orderby, order).each(function(cat){
if (!cat.length) return;

if (style === 'list'){
html += '<li class="' + className + '-list-item">' +
'<a class="' + className + '-list-link" href="' + root + cat.path + '">' + cat.name + '</a>' +
(showCount ? '<span class="' + className + '-list-count">' + cat.length + '</span>' : '');

if (depth == 0 || depth > i + 1){
var child = list(i + 1, cat._id);

if (child){
html += '<ul class="' + className + '-list-child">' + child + '</ul>';
}
}

html += '</li>';

if (i == 0 && depth > -1) {
arr.push(html);
html = '';
}
} else {
arr.push('<a class="' + className + '-link" href="' + root + cat.path + '">' +
cat.name +
(showCount ? '<span class="' + className + '-count">' + cat.length + '</span>' : '') +
'</a>');

