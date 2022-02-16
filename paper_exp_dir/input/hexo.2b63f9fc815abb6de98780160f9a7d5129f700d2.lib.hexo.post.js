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

