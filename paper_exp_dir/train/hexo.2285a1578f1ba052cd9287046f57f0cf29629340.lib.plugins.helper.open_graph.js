'use strict';

const urlFn = require('url');
const moment = require('moment');
const { encodeURL, htmlTag, stripHTML } = require('hexo-util');

function meta(name, content) {
return `${htmlTag('meta', {
name,
content
})}\n`;
}

function og(name, content) {
return `${htmlTag('meta', {
property: name,
content
})}\n`;
}

function openGraphHelper(options = {}) {

const { config, page } = this;
const { content } = page;
let images = options.image || options.images || page.photos || [];
let description = options.description || page.description || page.excerpt || content || config.description;
const keywords = page.keywords || (page.tags && page.tags.length ? page.tags : undefined) || config.keywords;
const title = options.title || page.title || config.title;
const type = options.type || (this.is_post() ? 'article' : 'website');
let url = options.url || this.url;
const siteName = options.site_name || config.title;
const twitterCard = options.twitter_card || 'summary';
const date = options.date !== false ? options.date || page.date : false;
const updated = options.updated !== false ? options.updated || page.updated : false;
const language = options.language || page.lang || page.language || config.language;
const author = options.author || config.author;

if (!Array.isArray(images)) images = [images];

if (description) {
description = stripHTML(description).substring(0, 200)
.trim()
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/&/g, '&amp;')
