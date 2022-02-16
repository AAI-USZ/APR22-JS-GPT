var extend = require('../extend'),
util = require('../util'),
titlecase = util.titlecase,
Taxonomy = require('../model').Taxonomy,
_ = require('underscore'),
config = hexo.config;

var regex = {
excerpt: /<!--\s*more\s*-->/
};

var capitalize = function(str){
return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

var execute = function(item){
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

extend.processor.register(function(locals, callback){
var cats = {},
tags = {};

locals.posts.each(function(item, i){
if (item.categories){
_.each(item.categories, function(cat){
if (cats.hasOwnProperty(cat.name)){
cats[cat.name].push(item);
} else {
var newCat = locals.posts.slice(i, i + 1);
newCat.path = cat.path;
newCat.permalink = cat.permalink;
cats[cat.name] = newCat;
