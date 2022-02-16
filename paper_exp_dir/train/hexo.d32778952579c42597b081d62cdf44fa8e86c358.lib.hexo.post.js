'use strict';

const assert = require('assert');
const moment = require('moment');
const Promise = require('bluebird');
const { join, extname, basename } = require('path');
const { magenta } = require('chalk');
const { load } = require('js-yaml');
const { slugize, escapeRegExp } = require('hexo-util');
const { copyDir, exists, listDir, mkdirs, readFile, rmdir, unlink, writeFile } = require('hexo-fs');
const yfm = require('hexo-front-matter');

const replaceSwigTag = str => str.replace(/{/g, '\uFFFCleft\uFFFC').replace(/}/g, '\uFFFCright\uFFFC');
const restoreReplacesSwigTag = str => str.replace(/\uFFFCleft\uFFFC/g, '&#123;').replace(/\uFFFCright\uFFFC/g, '&#125;');

const preservedKeys = ['title', 'slug', 'path', 'layout', 'date', 'content'];

const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;
const rSwigVar = /\{\{[\s\S]*?\}\}/g;
const rSwigComment = /\{#[\s\S]*?#\}/g;
const rSwigBlock = /\{%[\s\S]*?%\}/g;
const rSwigFullBlock = /\{% *(.+?)(?: *| +.*?)%\}[\s\S]+?\{% *end\1 *%\}/g;
