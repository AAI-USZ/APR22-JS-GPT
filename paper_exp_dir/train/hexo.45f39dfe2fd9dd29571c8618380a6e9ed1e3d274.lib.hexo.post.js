var moment = require('moment');
var swig = require('swig');
var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');
var util = require('hexo-util');
var fs = require('hexo-fs');
var yfm = require('hexo-front-matter');
var vm = require('vm');
var swigFilters = require('swig/lib/filters');
var swigUtils = require('swig/lib/utils');
var swigParser = require('swig/lib/parser');

var slugize = util.slugize;
var escapeRegExp = util.escapeRegExp;

var rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
var rSwigVar = /\{\{[\s\S]*?\}\}/g;
var rSwigComment = /\{#[\s\S]*?#\}/g;
var rSwigBlock = /\{%[\s\S]*?%\}/g;
var rSwigFullBlock = /\{% *(.*?) *.*?%\}[\s\S]+?\{% *end\1 *%\}/g;
var placeholder = '\uFFFC';
var rPlaceholder = /(?:<p>)?\uFFFC(\d+)(?:<\/p>)?/g;

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

function Post(context){
this.context = context;
}

Post.prototype.create = function(data, replace, callback){
if (!callback && typeof replace === 'function'){
callback = replace;
replace = false;
}

var ctx = this.context;
var config = ctx.config;

data.slug = slugize(data.slug || data.title, {transform: config.filename_case});
data.layout = (data.layout || config.default_layout).toLowerCase();
data.date = data.date ? moment(data.date) : moment();

return Promise.all([

ctx.execFilter('new_post_path', data, {
args: [replace],
context: ctx
}),

this._getScaffold(data.layout)
]).spread(function(path, scaffold){
data.date = data.date.format('YYYY-MM-DD HH:mm:ss');


var split = yfm.split(scaffold);
var separator = split.separator || '---';
var jsonMode = separator[0] === ';';

var frontMatter;

if (jsonMode){
frontMatter = prepareJFM(_.clone(data));
