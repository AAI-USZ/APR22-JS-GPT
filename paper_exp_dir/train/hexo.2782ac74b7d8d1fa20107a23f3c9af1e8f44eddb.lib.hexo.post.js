'use strict';

const moment = require('moment');
const Promise = require('bluebird');
const pathFn = require('path');
const assignIn = require('lodash/assignIn');
const clone = require('lodash/clone');
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

PostRenderCache.prototype.escapeContent = function(str) {
const rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
return str.replace(rEscapeContent, (_, content) => _escapeContent(this.cache, content));
};

PostRenderCache.prototype.loadContent = function(str) {
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;
return str.replace(rPlaceholder, (_, index) => this.cache[index]);
};

PostRenderCache.prototype.escapeAllSwigTags = function(str) {
const rSwigVar = /\{\{[\s\S]*?\}\}/g;
const rSwigComment = /\{#[\s\S]*?#\}/g;
const rSwigBlock = /\{%[\s\S]*?%\}/g;
const rSwigFullBlock = /\{% *(.+?)(?: *| +.*)%\}[\s\S]+?\{% *end\1 *%\}/g;

const escape = _str => _escapeContent(this.cache, _str);
return str.replace(rSwigFullBlock, escape)
.replace(rSwigBlock, escape)
.replace(rSwigComment, '')
.replace(rSwigVar, escape);
};

function Post(context) {
this.context = context;
}

Post.prototype.create = function(data, replace, callback) {
if (!callback && typeof replace === 'function') {
callback = replace;
replace = false;
}

const ctx = this.context;
const { config } = ctx;

data.slug = slugize((data.slug || data.title).toString(), {transform: config.filename_case});
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

fs.writeFile(path, content),

createAssetFolder(path, config.post_asset_folder)
]).then(() => {
ctx.emit('new', result);
}).thenReturn(result);
}).asCallback(callback);
};

function prepareFrontMatter(data) {
for (const key of Object.keys(data)) {
const item = data[key];

if (moment.isMoment(item)) {
data[key] = item.utc().format('YYYY-MM-DD HH:mm:ss');
} else if (moment.isDate(item)) {
data[key] = moment.utc(item).format('YYYY-MM-DD HH:mm:ss');
} else if (typeof item === 'string') {
data[key] = `"${item}"`;
}
}

return data;
}

Post.prototype._getScaffold = function(layout) {
const ctx = this.context;

return ctx.scaffold.get(layout).then(result => {
if (result != null) return result;
return ctx.scaffold.get('normal');
});
};

Post.prototype._renderScaffold = function(data) {
const tag = this.context.extend.tag;
let yfmSplit;

return this._getScaffold(data.layout).then(scaffold => {
const frontMatter = prepareFrontMatter(clone(data));
yfmSplit = yfm.split(scaffold);

return tag.render(yfmSplit.data, frontMatter);
}).then(frontMatter => {
const separator = yfmSplit.separator;
const jsonMode = separator[0] === ';';


const obj = jsonMode ? JSON.parse(`{${frontMatter}}`) : yaml.load(frontMatter);


for (const key of Object.keys(data)) {
if (!preservedKeys.includes(key) && obj[key] == null) {
obj[key] = data[key];
}
}

