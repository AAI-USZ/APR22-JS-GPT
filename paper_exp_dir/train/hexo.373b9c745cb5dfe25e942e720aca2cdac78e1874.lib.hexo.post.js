'use strict';

const moment = require('moment');
const Promise = require('bluebird');
const pathFn = require('path');
const _ = require('lodash');
const yaml = require('js-yaml');
const { slugize, escapeRegExp } = require('hexo-util');
const fs = require('hexo-fs');
const yfm = require('hexo-front-matter');

const preservedKeys = ['title', 'slug', 'path', 'layout', 'date', 'content'];

function PostRenderCache() {
this.cache = [];
}

const _escapeContent = (cache, str) => {
const placeholder = '\uFFFC';
return `<!--${placeholder}${cache.push(str) - 1}-->`;
};
