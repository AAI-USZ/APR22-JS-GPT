var path = require('path'),
fs = require('graceful-fs'),
async = require('async'),
_ = require('lodash'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2;

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
permalink_defaults: {},

source_dir: 'source',
public_dir: 'public',

new_post_name: ':title.md',
default_layout: 'post',
titlecase: false,
external_link: true,
filename_case: 0,
render_drafts: false,
post_asset_folder: false,
relative_link: false,
highlight: {
enable: true,
line_number: true,
tab_replace: '',
