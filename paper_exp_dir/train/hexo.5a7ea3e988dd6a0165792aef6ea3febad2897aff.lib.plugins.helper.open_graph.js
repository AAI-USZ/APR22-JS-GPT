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
.replace(/'/g, '&apos;')
.replace(/\n/g, ' '); // Replace new lines by spaces
}

if (!images.length && content) {
images = images.slice();

var $ = cheerio.load(content);

$('img').each(function() {
