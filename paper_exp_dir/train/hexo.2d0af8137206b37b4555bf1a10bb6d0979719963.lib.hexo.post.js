'use strict';

var moment = require('moment');
var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');
var util = require('hexo-util');
var fs = require('hexo-fs');
var yfm = require('hexo-front-matter');

var slugize = util.slugize;
var escapeRegExp = util.escapeRegExp;

var rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
var rSwigVar = /\{\{[\s\S]*?\}\}/g;
var rSwigComment = /\{#[\s\S]*?#\}/g;
var rSwigBlock = /\{%[\s\S]*?%\}/g;
var rSwigFullBlock = /\{% *(.+?)(?: *| +.*)%\}[\s\S]+?\{% *end\1 *%\}/g;
var placeholder = '\uFFFC';
var rPlaceholder = /(?:<|&lt;)\!--\uFFFC(\d+)--(?:>|&gt;)/g;

var preservedKeys = {
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

var ctx = this.context;
var config = ctx.config;

data.slug = slugize((data.slug || data.title).toString(), {transform: config.filename_case});
data.layout = (data.layout || config.default_layout).toLowerCase();
data.date = data.date ? moment(data.date) : moment();

return Promise.all([

ctx.execFilter('new_post_path', data, {
args: [replace],
context: ctx
}),
this._renderScaffold(data)
]).spread(function(path, content) {
var result = {
path: path,
content: content
};

return Promise.all([

fs.writeFile(path, content),

createAssetFolder(path, config.post_asset_folder)
]).then(function() {
ctx.emit('new', result);
}).thenReturn(result);
}).asCallback(callback);
};

function prepareFrontMatter(data) {
var keys = Object.keys(data);
var key = '';
var item;

for (var i = 0, len = keys.length; i < len; i++) {
key = keys[i];
item = data[key];

if (moment.isMoment(item)) {
data[key] = item.utc().format('YYYY-MM-DD HH:mm:ss');
} else if (moment.isDate(item)) {
data[key] = moment.utc(item).format('YYYY-MM-DD HH:mm:ss');
} else if (typeof item === 'string') {
data[key] = '"' + item + '"';
}
}

return data;
}

Post.prototype._getScaffold = function(layout) {
var ctx = this.context;

return ctx.scaffold.get(layout).then(function(result) {
if (result != null) return result;
return ctx.scaffold.get('normal');
});
};

Post.prototype._renderScaffold = function(data) {
var tag = this.context.extend.tag;
var yfmSplit;

return this._getScaffold(data.layout).then(function(scaffold) {
var frontMatter = prepareFrontMatter(_.clone(data));
yfmSplit = yfm.split(scaffold);

return tag.render(yfmSplit.data, frontMatter);
}).then(function(frontMatter) {
var separator = yfmSplit.separator;
var jsonMode = separator[0] === ';';
var content = '';
var obj;


if (jsonMode) {
obj = JSON.parse('{' + frontMatter + '}');
} else {
obj = yaml.load(frontMatter);
}


var keys = Object.keys(data);
var key = '';

for (var i = 0, len = keys.length; i < len; i++) {
key = keys[i];

if (!preservedKeys[key] && obj[key] == null) {
obj[key] = data[key];
}
}


if (yfmSplit.prefixSeparator) content += separator + '\n';

content += yfm.stringify(obj, {
mode: jsonMode ? 'json' : ''
});


content += yfmSplit.content;

if (data.content) {
content += '\n' + data.content;
}

return content;
});
};

function createAssetFolder(path, assetFolder) {
if (!assetFolder) return Promise.resolve();

var target = removeExtname(path);

return fs.exists(target).then(function(exist) {
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

var ctx = this.context;
var config = ctx.config;
var draftDir = pathFn.join(ctx.source_dir, '_drafts');
var slug = data.slug = slugize(data.slug.toString(), {transform: config.filename_case});
var regex = new RegExp('^' + escapeRegExp(slug) + '(?:[^\\/\\\\]+)');
var self = this;
var src = '';
var result = {};

data.layout = (data.layout || config.default_layout).toLowerCase();


return fs.listDir(draftDir).then(function(list) {
var item = '';

for (var i = 0, len = list.length; i < len; i++) {
item = list[i];
if (regex.test(item)) return item;
}
}).then(function(item) {
if (!item) throw new Error('Draft "' + slug + '" does not exist.');


src = pathFn.join(draftDir, item);
return fs.readFile(src);
}).then(function(content) {

_.extend(data, yfm(content));
data.content = data._content;
delete data._content;

return self.create(data, replace).then(function(post) {
result.path = post.path;
result.content = post.content;
});
}).then(function() {

return fs.unlink(src);
}).then(function() {
if (!config.post_asset_folder) return;


var assetSrc = removeExtname(src);
var assetDest = removeExtname(result.path);

return fs.exists(assetSrc).then(function(exist) {
if (!exist) return;

return fs.copyDir(assetSrc, assetDest).then(function() {
return fs.rmdir(assetSrc);
});
});
}).thenReturn(result).asCallback(callback);
};

Post.prototype.render = function(source, data, callback) {
data = data || {};

var ctx = this.context;
var config = ctx.config;
var cache = [];
var tag = ctx.extend.tag;
var ext = data.engine || (source ? pathFn.extname(source) : '');

var isSwig = ext === 'swig';

var disableNunjucks = false;

if (ext && ctx.render.renderer.get(ext)) {



disableNunjucks = disableNunjucks || !!ctx.render.renderer.get(ext).disableNunjucks;

}

