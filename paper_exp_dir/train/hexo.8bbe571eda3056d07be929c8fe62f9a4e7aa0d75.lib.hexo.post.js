'use strict';

const moment = require('moment');
const Promise = require('bluebird');
const pathFn = require('path');
const _ = require('lodash');
const yaml = require('js-yaml');
const util = require('hexo-util');
const fs = require('hexo-fs');
const yfm = require('hexo-front-matter');

const slugize = util.slugize;
const escapeRegExp = util.escapeRegExp;

const rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
const rSwigVar = /\{\{[\s\S]*?\}\}/g;
const rSwigComment = /\{#[\s\S]*?#\}/g;
const rSwigBlock = /\{%[\s\S]*?%\}/g;
const rSwigFullBlock = /\{% *(.+?)(?: *| +.*)%\}[\s\S]+?\{% *end\1 *%\}/g;
const placeholder = '\uFFFC';
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;

const preservedKeys = {
title: true,
slug: true,
path: true,
layout: true,
date: true,
content: true
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
const config = ctx.config;

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
const result = {
path,
content
};

return Promise.all([

fs.writeFile(path, content),

createAssetFolder(path, config.post_asset_folder)
]).then(() => {
ctx.emit('new', result);
}).thenReturn(result);
}).asCallback(callback);
};

function prepareFrontMatter(data) {
const keys = Object.keys(data);
let key = '';
let item;

for (let i = 0, len = keys.length; i < len; i++) {
key = keys[i];
item = data[key];

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
const frontMatter = prepareFrontMatter(_.clone(data));
yfmSplit = yfm.split(scaffold);

return tag.render(yfmSplit.data, frontMatter);
}).then(frontMatter => {
const separator = yfmSplit.separator;
const jsonMode = separator[0] === ';';
let content = '';
let obj;


if (jsonMode) {
obj = JSON.parse(`{${frontMatter}}`);
} else {
obj = yaml.load(frontMatter);
}


const keys = Object.keys(data);
let key = '';

for (let i = 0, len = keys.length; i < len; i++) {
key = keys[i];

if (!preservedKeys[key] && obj[key] == null) {
obj[key] = data[key];
}
}


if (yfmSplit.prefixSeparator) content += `${separator}\n`;

content += yfm.stringify(obj, {
mode: jsonMode ? 'json' : ''
});


content += yfmSplit.content;

if (data.content) {
content += `\n${data.content}`;
}

return content;
});
};

function createAssetFolder(path, assetFolder) {
if (!assetFolder) return Promise.resolve();

const target = removeExtname(path);

return fs.exists(target).then(exist => {
if (!exist) return fs.mkdirs(target);
});
}

function removeExtname(str) {
return str.substring(0, str.length - pathFn.extname(str).length);
}

Post.prototype.publish = function(data, replace, callback) {
if (!callback && typeof replace === 'function') {
callback = replace;
replace = false;
}

if (data.layout === 'draft') data.layout = 'post';

const ctx = this.context;
const config = ctx.config;
const draftDir = pathFn.join(ctx.source_dir, '_drafts');
const slug = data.slug = slugize(data.slug.toString(), {transform: config.filename_case});
const regex = new RegExp(`^${escapeRegExp(slug)}(?:[^\\/\\\\]+)`);
const self = this;
let src = '';
const result = {};

data.layout = (data.layout || config.default_layout).toLowerCase();


return fs.listDir(draftDir).then(list => {
let item = '';

for (let i = 0, len = list.length; i < len; i++) {
item = list[i];
if (regex.test(item)) return item;
}
}).then(item => {
if (!item) throw new Error(`Draft "${slug}" does not exist.`);


src = pathFn.join(draftDir, item);
return fs.readFile(src);
}).then(content => {

_.extend(data, yfm(content));
data.content = data._content;
delete data._content;

return self.create(data, replace).then(post => {
result.path = post.path;
result.content = post.content;
});
}).then(() =>
fs.unlink(src)).then(() => {
if (!config.post_asset_folder) return;


const assetSrc = removeExtname(src);
const assetDest = removeExtname(result.path);

return fs.exists(assetSrc).then(exist => {
if (!exist) return;

return fs.copyDir(assetSrc, assetDest).then(() => fs.rmdir(assetSrc));
});
}).thenReturn(result).asCallback(callback);
};

Post.prototype.render = function(source, data = {}, callback) {
const ctx = this.context;
const config = ctx.config;
const cache = [];
const tag = ctx.extend.tag;
const ext = data.engine || (source ? pathFn.extname(source) : '');

const isSwig = ext === 'swig';

let disableNunjucks = false;

if (ext && ctx.render.renderer.get(ext)) {



disableNunjucks = disableNunjucks || !!ctx.render.renderer.get(ext).disableNunjucks;

}

function escapeContent(str) {
return `<!--${placeholder}${cache.push(str) - 1}-->`;
}

function tagFilter(content) {
if (disableNunjucks) return content;

content = content.replace(rPlaceholder, function(...args) {
return cache[args[1]];
});


data.content = content;
return tag.render(data.content, data);
}

let promise;

if (data.content != null) {
promise = Promise.resolve(data.content);
} else if (source) {

promise = fs.readFile(source);
} else {
return Promise.reject(new Error('No input file or string!')).asCallback(callback);
}
