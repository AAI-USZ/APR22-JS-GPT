var _ = require('lodash'),
cheerio = require('cheerio'),
util = require('../../util'),
htmlTag = util.html_tag,
format = util.format;

var metaTag = function(name, content){
var data = {};

switch (name.split(':')[0]){
case 'og':
case 'fb':
data.property = name;
break;

default:
data.name = name;
}

data.content = content;

return htmlTag('meta', data) + '\n';
};

module.exports = function(options){
var page = this.page,
config = this.config || hexo.config,
content = page.content,
images = page.photos || [];

var description = page.description || '';

if (!description){
if (page.excerpt){
description = format.stripHtml(page.excerpt);
} else if (page.content){
description = format.stripHtml(content);
} else if (config.description){
description = config.description;
}
}

description = description.substring(0, 200).replace(/^\s+|\s+$/g, '')
.replace(/\"/g, '\'')
.replace(/\>/g, "&amp;");

if (!images.length && content){
var $ = cheerio.load(content);

$('img').each(function(){
var src = $(this).attr('src');
if (src) images.push(src);
