'use strict';

var moment = require('moment');
var swig = require('swig');
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

swig.setDefaults({
autoescape: false
});

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

this._getScaffold(data.layout)
]).spread(function(path, scaffold) {

var split = yfm.split(scaffold);
var separator = split.separator || '---';
var jsonMode = separator[0] === ';';
var frontMatter = prepareFrontMatter(_.clone(data));
var content = '';


var renderedData = swig.compile(split.data)(frontMatter);


var compiled;

if (jsonMode) {
compiled = JSON.parse('{' + renderedData + '}');
} else {
compiled = yaml.load(renderedData);
}


var keys = Object.keys(data);
var key = '';
var obj = compiled;

for (var i = 0, len = keys.length; i < len; i++) {
key = keys[i];

if (!preservedKeys[key] && obj[key] == null) {
obj[key] = data[key];
}
}


if (split.prefixSeparator) content += separator + '\n';

content += yfm.stringify(obj, {
mode: jsonMode ? 'json' : ''
});


content += split.content;

if (data.content) {
content += '\n' + data.content;
}

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
}).nodeify(callback);
};

function prepareFrontMatter(data) {
