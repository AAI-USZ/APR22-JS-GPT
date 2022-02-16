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

const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;
const rHexoPostRenderEscape = /<!--hexoPostRenderEscape:([\s\S]+?):hexoPostRenderEscape-->/g;
const rSwigVarAndComment = /{[{#][\s\S]+?[}#]}/g;
const rSwigFullBlock = /{% *(\S+?)(?: *| +.+?)%}[\s\S]+?{% *end\1 *%}/g;
const rSwigBlock = /{%[\s\S]+?%}/g;

const _escapeContent = (cache, str) => `<!--\uFFFC${cache.push(str) - 1}-->`;

class PostRenderCache {
constructor() {
this.cache = [];
