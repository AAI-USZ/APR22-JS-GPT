var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
term = require('term'),
_ = require('lodash'),
EventEmitter = require('events').EventEmitter,
Database = require('warehouse'),
call = require('./call'),
extend = require('./extend'),
i18n = require('./i18n'),
render = require('./render'),
route = require('./route'),
util = require('./util');

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
