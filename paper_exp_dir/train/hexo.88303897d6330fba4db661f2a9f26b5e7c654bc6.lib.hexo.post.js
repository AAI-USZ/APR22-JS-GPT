'use strict';

const assert = require('assert');
const moment = require('moment');
const Promise = require('bluebird');
const { join, extname, basename } = require('path');
const { magenta } = require('chalk');
const { load } = require('js-yaml');
const { slugize, escapeRegExp } = require('hexo-util');
const { copyDir, exists, listDir, mkdirs, readFile, rmdir, unlink, writeFile } = require('hexo-fs');
const { parse: yfmParse, split: yfmSplit, stringify: yfmStringify } = require('hexo-front-matter');
const preservedKeys = ['title', 'slug', 'path', 'layout', 'date', 'content'];

const rHexoPostRenderEscape = /<hexoPostRenderCodeBlock>([\s\S]+?)<\/hexoPostRenderCodeBlock>/g;
const rSwigVarAndComment = /{[{#][\s\S]+?[}#]}/g;
const rSwigFullBlock = /{% *(\S+?)(?: *| +.+?)%}[\s\S]+?{% *end\1 *%}/g;
const rSwigBlock = /{%[\s\S]+?%}/g;

const rSwigPlaceHolder = /(?:<|&lt;)!--swig\uFFFC(\d+)--(?:>|&gt;)/g;
const rCodeBlockPlaceHolder = /(?:<|&lt;)!--code\uFFFC(\d+)--(?:>|&gt;)/g;

const _escapeContent = (cache, flag, str) => `<!--${flag}\uFFFC${cache.push(str) - 1}-->`;

const _restoreContent = cache => (_, index) => {
