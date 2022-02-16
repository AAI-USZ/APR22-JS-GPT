var extend = require('../extend'),
util = require('../util'),
titlecase = util.titlecase,
Taxonomy = require('../model').Taxonomy,
_ = require('underscore'),
config;

var regex = {
excerpt: /<!--\s*more\s*-->/
};

var capitalize = function(str){
return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

var execute = function(item){
if (!config) config = hexo.config;

var content = item.content;


if (config.auto_spacing){
content = content
.replace(/([\u4e00-\u9fa5\u3040-\u30FF])([a-z0-9@#&;=_\[\$\%\^\*\-\+\(\/])/ig, '$1 $2')
.replace(/([a-z0-9#!~&;=_\]\,\.\:\?\$\%\^\*\-\+\)\/])([\u4e00-\u9fa5\u3040-\u30FF])/ig, '$1 $2');
}

if (config.titlecase){
item.title = titlecase(item.title);
}

if (content.match(regex.excerpt)){
item.content = content.replace(regex.excerpt, '<span id="more"></span>');
item.excerpt = content.split(regex.excerpt)[0];
} else {
item.content = content;
}

return item;
};

extend.process.register(function(locals, callback){
var cats = {},
tags = {};

console.log('Analyzing source files.');

locals.posts = locals.posts.sort('date', -1);
locals.pages = locals.pages.sort('date', -1);

locals.posts.each(function(item, i){
if (item.categories){
_.each(item.categories, function(cat){
if (cats.hasOwnProperty(cat.name)){
cats[cat.name].push(item);
