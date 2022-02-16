'use strict';

const assert = require('assert');
const moment = require('moment');
const Promise = require('bluebird');
const { join, extname } = require('path');
const { magenta } = require('chalk');
const { load } = require('js-yaml');
const { slugize, escapeRegExp } = require('hexo-util');
const { copyDir, exists, listDir, mkdirs, readFile, rmdir, unlink, writeFile } = require('hexo-fs');
const yfm = require('hexo-front-matter');

const preservedKeys = ['title', 'slug', 'path', 'layout', 'date', 'content'];

const _escapeContent = (cache, str) => {
const placeholder = '\uFFFC';
return `<!--${placeholder}${cache.push(str) - 1}-->`;
};

class PostRenderCache {
constructor() {
this.cache = [];
}

escapeContent(str) {
const rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
return str.replace(rEscapeContent, (_, content) => _escapeContent(this.cache, content));
}

loadContent(str) {
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;
const restored = str.replace(rPlaceholder, (_, index) => {
assert(this.cache[index]);
const value = this.cache[index];
this.cache[index] = null;
return value;
});
if (restored === str) return restored;
return this.loadContent(restored);
}

escapeAllSwigTags(str) {
const rSwigVar = /\{\{[\s\S]*?\}\}/g;
const rSwigComment = /\{#[\s\S]*?#\}/g;
const rSwigBlock = /\{%[\s\S]*?%\}/g;
const rSwigFullBlock = /\{% *(.+?)(?: *| +.*)%\}[\s\S]+?\{% *end\1 *%\}/g;

const escape = _str => _escapeContent(this.cache, _str);
return str.replace(rSwigFullBlock, escape)
.replace(rSwigBlock, escape)
.replace(rSwigComment, '')
.replace(rSwigVar, escape);
}
}

const prepareFrontMatter = data => {
for (const [key, item] of Object.entries(data)) {
if (moment.isMoment(item)) {
data[key] = item.utc().format('YYYY-MM-DD HH:mm:ss');
} else if (moment.isDate(item)) {
data[key] = moment.utc(item).format('YYYY-MM-DD HH:mm:ss');
} else if (typeof item === 'string') {
data[key] = `"${item}"`;
}
}

