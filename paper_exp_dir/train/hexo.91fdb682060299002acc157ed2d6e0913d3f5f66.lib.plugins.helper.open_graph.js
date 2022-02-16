'use strict';

const urlFn = require('url');
const moment = require('moment');
const util = require('hexo-util');
const htmlTag = util.htmlTag;
const stripHTML = util.stripHTML;
const escapeHTML = util.escapeHTML;
let cheerio;

function meta(name, content, escape) {
if (escape !== false && typeof content === 'string') {
content = escapeHTML(content);
}

return `${htmlTag('meta', {
name,
content
})}\n`;
}

function og(name, content, escape) {
if (escape !== false && typeof content === 'string') {
content = escapeHTML(content);
}

return `${htmlTag('meta', {
property: name,
content
})}\n`;
}

function openGraphHelper(options = {}) {
if (!cheerio) cheerio = require('cheerio');

const page = this.page;
const config = this.config;
const content = page.content;
let images = options.image || options.images || page.photos || [];
let description = options.description || page.description || page.excerpt || content || config.description;
const keywords = page.keywords || (page.tags && page.tags.length ? page.tags : undefined) || config.keywords;
const title = options.title || page.title || config.title;
const type = options.type || (this.is_post() ? 'article' : 'website');
const url = options.url || this.url;
const siteName = options.site_name || config.title;
const twitterCard = options.twitter_card || 'summary';
const updated = options.updated !== false ? options.updated || page.updated : false;
const language = options.language || page.lang || page.language || config.language;

if (!Array.isArray(images)) images = [images];

if (description) {
description = stripHTML(description).substring(0, 200)
.trim()
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
