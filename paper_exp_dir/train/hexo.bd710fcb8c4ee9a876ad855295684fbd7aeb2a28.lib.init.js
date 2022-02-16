var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
term = require('term'),
_ = require('lodash'),
EventEmitter = require('events').EventEmitter,
Database = require('warehouse'),
extend = require('./extend'),
render = require('./render'),
util = require('./util'),
call = require('./call'),
i18n = require('./i18n'),
route = require('./route'),
Log = require('./log');

var defaults = {

title: 'Hexo',
subtitle: '',
description: '',
author: 'John Doe',
email: '',
language: '',

url: 'http://yoursite.com',
root: '/',
permalink: ':year/:month/:day/:title/',
tag_dir: 'tags',
archive_dir: 'archives',
category_dir: 'categories',
code_dir: 'downloads/code',

new_post_name: ':title.md',
default_layout: 'post',
auto_spacing: false,
titlecase: false,
max_open_file: 100,
filename_case: 0,
highlight: {
enable: true,
line_number: true,
tab_replace: '',
},

default_category: 'uncategorized',
category_map: {},
tag_map: {},

archive: 2,
category: 2,
tag: 2,

port: 4000,
logger: false,
logger_format: '',

date_format: 'MMM D YYYY',
time_format: 'H:mm:ss',

per_page: 10,
pagination_dir: 'page',

disqus_shortname: '',

theme: 'light',
exclude_generator: [],

deploy: {}
};

var loadScripts = function(path, crtical_err, item_err, success){
fs.exists(path, function(exist){
if (!exist) return success();

fs.readdir(path, function(err, files){
if (err) return crtical_err(err);

files.forEach(function(item){
if (item.substring(0, 1) !== '.'){
try {
