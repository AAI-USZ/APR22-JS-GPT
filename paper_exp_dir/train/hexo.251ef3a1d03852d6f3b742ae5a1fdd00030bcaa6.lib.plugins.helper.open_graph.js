var _ = require('lodash'),
util = require('../../util'),
htmlTag = util.html_tag,
format = util.format;

var rCover = /<img([\s\S]*?)src="(.+?)"([\s\S]*?)>/;

var metaTag = function(name, content){
return htmlTag('meta', {name: name, content: content});
};

module.exports = function(options){
var page = this.page,
content = page.content,
cover = page.photos ? page.photos[0] : '';

var description = page.description || '';

if (!description){
if (page.excerpt){
description = format.strip_html(page.excerpt);
} else if (page.content){
description = format.strip_html(content);
}
}

description = description.substring(0, 200).replace(/^\s+|\s+$/g, '');

if (!cover && rCover.test(content)){
