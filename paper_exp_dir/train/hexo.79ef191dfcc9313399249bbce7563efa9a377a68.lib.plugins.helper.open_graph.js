'use strict';

const urlFn = require('url');
const moment = require('moment');
const { escapeHTML, htmlTag, stripHTML } = require('hexo-util');

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
.replace(/'/g, '&apos;')
.replace(/\n/g, ' '); // Replace new lines by spaces
}

if (!images.length && content) {
images = images.slice();

if (content.includes('<img')) {
let img;
const imgPattern = /<img [^>]*src=['"]([^'"]+)([^>]*>)/gi;
while ((img = imgPattern.exec(content)) !== null) {
images.push(img[1]);
}
}

}

let result = '';

if (description) {
result += meta('description', description, false);
}

if (keywords) {
if (typeof keywords === 'string') {
result += meta('keywords', keywords);
} else if (keywords.length) {
result += meta('keywords', keywords.map(tag => {
return tag.name ? tag.name : tag;
}).filter(keyword => !!keyword).join());
}
}

result += og('og:type', type);
result += og('og:title', title);

if (config.pretty_urls.trailing_index === false) {
url = url.replace(/index\.html$/, '');
}

url = urlFn.format({
protocol: urlFn.parse(url).protocol,
hostname: urlFn.parse(url).hostname,
pathname: encodeURI(urlFn.parse(url).pathname)
});
result += og('og:url', url, false);

result += og('og:site_name', siteName);
if (description) {
result += og('og:description', description, false);
}
