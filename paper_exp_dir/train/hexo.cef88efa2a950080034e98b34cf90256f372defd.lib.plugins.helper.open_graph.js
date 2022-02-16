var _ = require('lodash'),
util = require('../../util'),
htmlTag = util.html_tag,
format = util.format;

var rCover = /<img([\s\S]*?)src="(.+?)"([\s\S]*?)>/;

var metaTag = function(name, content){
var namespace = name.split(':')[0],
data = {content: content};

data[namespace === 'twitter' ? 'name' : 'property'] = name;

return htmlTag('meta', data);
};

module.exports = function(options){
var page = this.page,
config = this.config,
content = page.content,
cover = page.photos ? page.photos[0] : '';

var description = page.description || '';

if (!description){
if (page.excerpt){
description = format.strip_html(page.excerpt);
} else if (page.content){
