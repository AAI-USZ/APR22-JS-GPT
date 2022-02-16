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
