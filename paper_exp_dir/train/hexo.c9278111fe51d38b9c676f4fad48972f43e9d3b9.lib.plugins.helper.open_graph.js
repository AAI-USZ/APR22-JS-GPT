'use strict';

var urlFn = require('url');
var moment = require('moment');
var util = require('hexo-util');
var htmlTag = util.htmlTag;
var stripHTML = util.stripHTML;
var cheerio;

function meta(name, content) {
return htmlTag('meta', {
name: name,
content: content
}) + '\n';
}

function og(name, content) {
return htmlTag('meta', {
property: name,
content: content
}) + '\n';
}

function openGraphHelper(options) {
options = options || {};

if (!cheerio) cheerio = require('cheerio');

var page = this.page;
var config = this.config;
var content = page.content;
var images = options.image || options.images || page.photos || [];
var description = options.description || page.description || page.excerpt || content || config.description;
var keywords = page.tags;
var title = options.title || page.title || config.title;
var type = options.type || (this.is_post() ? 'article' : 'website');
var url = options.url || this.url;
var siteName = options.site_name || config.title;
var twitterCard = options.twitter_card || 'summary';
var updated = options.updated !== false ? (options.updated || page.updated) : false;
var result = '';

if (!Array.isArray(images)) images = [images];

if (description) {
description = stripHTML(description).substring(0, 200)
.trim()
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&apos;');
}

if (!images.length && content) {
images = images.slice();

var $ = cheerio.load(content);

$('img').each(function() {
var src = $(this).attr('src');
if (src) images.push(src);
});
}

if (description) {
result += meta('description', description);
}

if (keywords && keywords.toArray()) {
result += meta('keywords', keywords.map(function(tag) {
return tag.name;
}).filter(function(keyword) {
return !!keyword;
}).join());
}

result += og('og:type', type);
result += og('og:title', title);
result += og('og:url', url);
result += og('og:site_name', siteName);
if (description) {
result += og('og:description', description);
}

images = images.map(function(path) {
if (!urlFn.parse(path).host) {
// resolve `path`'s absolute path relative to current page's url
// `path` can be both absolute (starts with `/`) or relative.
return urlFn.resolve(url || config.url, path);
}

return path;
});

images.forEach(function(path) {
result += og('og:image', path);
