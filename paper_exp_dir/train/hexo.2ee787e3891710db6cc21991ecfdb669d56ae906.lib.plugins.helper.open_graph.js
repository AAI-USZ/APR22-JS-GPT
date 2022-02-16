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
