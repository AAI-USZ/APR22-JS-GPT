'use strict';

const moment = require('moment');
const Promise = require('bluebird');
const pathFn = require('path');
const _ = require('lodash');
const yaml = require('js-yaml');
const { slugize, escapeRegExp } = require('hexo-util');
const fs = require('hexo-fs');
const yfm = require('hexo-front-matter');

const rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
const rSwigVar = /\{\{[\s\S]*?\}\}/g;
const rSwigComment = /\{#[\s\S]*?#\}/g;
const rSwigBlock = /\{%[\s\S]*?%\}/g;
const rSwigFullBlock = /\{% *(.+?)(?: *| +.*)%\}[\s\S]+?\{% *end\1 *%\}/g;
const placeholder = '\uFFFC';
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;

const preservedKeys = ['title', 'slug', 'path', 'layout', 'date', 'content'];
