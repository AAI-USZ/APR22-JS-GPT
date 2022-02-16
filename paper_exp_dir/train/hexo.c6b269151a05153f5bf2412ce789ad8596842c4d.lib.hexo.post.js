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
const frontMatter = prepareFrontMatter({ ...data });
splited = yfmSplit(scaffold);

return tag.render(splited.data, frontMatter);
}).then(frontMatter => {
const { separator } = splited;
const jsonMode = separator.startsWith(';');


const obj = jsonMode ? JSON.parse(`{${frontMatter}}`) : load(frontMatter);


for (const key of Object.keys(data)) {
if (!preservedKeys.includes(key) && obj[key] == null) {
obj[key] = data[key];
}
}

let content = '';

if (splited.prefixSeparator) content += `${separator}\n`;

content += yfmStringify(obj, {
mode: jsonMode ? 'json' : ''
});


content += splited.content;

if (data.content) {
content += `\n${data.content}`;
}

return content;
});
}

publish(data, replace, callback) {
if (!callback && typeof replace === 'function') {
callback = replace;
replace = false;
}

if (data.layout === 'draft') data.layout = 'post';

const ctx = this.context;
const { config } = ctx;
const draftDir = join(ctx.source_dir, '_drafts');
const slug = slugize(data.slug.toString(), { transform: config.filename_case });
data.slug = slug;
const regex = new RegExp(`^${escapeRegExp(slug)}(?:[^\\/\\\\]+)`);
let src = '';
const result = {};

data.layout = (data.layout || config.default_layout).toLowerCase();


return listDir(draftDir).then(list => {
const item = list.find(item => regex.test(item));
if (!item) throw new Error(`Draft "${slug}" does not exist.`);


src = join(draftDir, item);
return readFile(src);
}).then(content => {

Object.assign(data, yfmParse(content));
data.content = data._content;
delete data._content;

return this.create(data, replace);
}).then(post => {
result.path = post.path;
result.content = post.content;
return unlink(src);
}).then(() => {
if (!config.post_asset_folder) return;


const assetSrc = removeExtname(src);
const assetDest = removeExtname(result.path);

return exists(assetSrc).then(exist => {
if (!exist) return;

return copyDir(assetSrc, assetDest).then(() => rmdir(assetSrc));
});
}).thenReturn(result).asCallback(callback);
}

render(source, data = {}, callback) {
const ctx = this.context;
const { config } = ctx;
const { tag } = ctx.extend;
const ext = data.engine || (source ? extname(source) : '');

let promise;

if (data.content != null) {
promise = Promise.resolve(data.content);
} else if (source) {

promise = readFile(source);
} else {
return Promise.reject(new Error('No input file or string!')).asCallback(callback);
}


let disableNunjucks = false;
let extRenderer = ext && ctx.render.renderer.get(ext);
if (extRenderer) {
disableNunjucks = Boolean(extRenderer.disableNunjucks);
if (!Object.prototype.hasOwnProperty.call(extRenderer, 'disableNunjucks')) {
extRenderer = ctx.render.renderer.get(ext, true);
if (extRenderer) {
disableNunjucks = Boolean(extRenderer.disableNunjucks);
}
}
}


if (typeof data.disableNunjucks === 'boolean') disableNunjucks = data.disableNunjucks;

const cacheObj = new PostRenderCache();

return promise.then(content => {
data.content = content;

return ctx.execFilter('before_post_render', data, { context: ctx });
}).then(() => {
data.content = cacheObj.escapeCodeBlocks(data.content);
