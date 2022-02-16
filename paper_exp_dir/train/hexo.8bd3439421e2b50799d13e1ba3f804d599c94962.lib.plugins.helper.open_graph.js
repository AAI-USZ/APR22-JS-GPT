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
