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
var title = options.title || page.title || config.title;
var type = options.type || (this.is_post() ? 'article' : 'website');
var url = options.url || this.url;
var siteName = options.site_name || config.title;
var twitterCard = options.twitter_card || 'summary';
var updated = options.updated || page.updated;
var result = '';

if (!Array.isArray(images)) images = [images];

if (description) {
description = stripHTML(description).substring(0, 200)
.replace(/^\s+|\s+$/g, '')
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

result += meta('description', description);
result += og('og:type', type);
result += og('og:title', title);
result += og('og:url', url);
result += og('og:site_name', siteName);
result += og('og:description', description);

images = images.map(function(path) {
if (!urlFn.parse(path).host) {
if (path[0] !== '/') path = '/' + path;
return config.url + path;
}

return path;
});
images.forEach(function(path) {
result += og('og:image', path);
});

if (updated) {
if ((moment.isMoment(updated) || moment.isDate(updated)) && !isNaN(updated.valueOf())) {
result += og('og:updated_time', updated.toISOString());
}
}
