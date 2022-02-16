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
assert(cache[index]);
const value = cache[index];
cache[index] = null;
return value;
};

class PostRenderCache {
constructor() {
this.cache = [];
}

restoreAllSwigTags(str) {
const restored = str.replace(rSwigPlaceHolder, _restoreContent(this.cache));
if (restored === str) return restored;
return this.restoreAllSwigTags(restored);
}

restoreCodeBlocks(str) {
return str.replace(rCodeBlockPlaceHolder, _restoreContent(this.cache));
}

escapeCodeBlocks(str) {
return str.replace(rHexoPostRenderEscape, (_, content) => _escapeContent(this.cache, 'code', content));
}

escapeAllSwigTags(str) {
const escape = _str => _escapeContent(this.cache, 'swig', _str);
return str.replace(rSwigVarAndComment, escape)
.replace(rSwigFullBlock, escape)
.replace(rSwigBlock, escape);
}
}

const prepareFrontMatter = (data, jsonMode) => {
for (const [key, item] of Object.entries(data)) {
if (moment.isMoment(item)) {
data[key] = item.utc().format('YYYY-MM-DD HH:mm:ss');
} else if (moment.isDate(item)) {
data[key] = moment.utc(item).format('YYYY-MM-DD HH:mm:ss');
} else if (typeof item === 'string') {
if (jsonMode || item.includes(':') || item.startsWith('#') || item.startsWith('!!')) data[key] = `"${item}"`;
}
}

return data;
};


const removeExtname = str => {
return str.substring(0, str.length - extname(str).length);
};

const createAssetFolder = (path, assetFolder) => {
if (!assetFolder) return Promise.resolve();

const target = removeExtname(path);

if (basename(target) === 'index') return Promise.resolve();

return exists(target).then(exist => {
if (!exist) return mkdirs(target);
});
};

class Post {
constructor(context) {
this.context = context;
}

create(data, replace, callback) {
if (!callback && typeof replace === 'function') {
callback = replace;
replace = false;
}

const ctx = this.context;
const { config } = ctx;

data.slug = slugize((data.slug || data.title).toString(), { transform: config.filename_case });
data.layout = (data.layout || config.default_layout).toLowerCase();
data.date = data.date ? moment(data.date) : moment();

return Promise.all([

ctx.execFilter('new_post_path', data, {
args: [replace],
context: ctx
}),
this._renderScaffold(data)
]).spread((path, content) => {
const result = { path, content };

return Promise.all([

writeFile(path, content),

createAssetFolder(path, config.post_asset_folder)
]).then(() => {
ctx.emit('new', result);
}).thenReturn(result);
}).asCallback(callback);
}

_getScaffold(layout) {
const ctx = this.context;

return ctx.scaffold.get(layout).then(result => {
if (result != null) return result;
return ctx.scaffold.get('normal');
});
}

_renderScaffold(data) {
const { tag } = this.context.extend;
let splited;

return this._getScaffold(data.layout).then(scaffold => {
splited = yfmSplit(scaffold);
const jsonMode = splited.separator.startsWith(';');
const frontMatter = prepareFrontMatter({ ...data }, jsonMode);

return tag.render(splited.data, frontMatter);
}).then(frontMatter => {
const { separator } = splited;
const jsonMode = separator.startsWith(';');
