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
