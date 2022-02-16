var path = require('path'),
fs = require('graceful-fs'),
async = require('async'),
_ = require('lodash'),
HexoError = require('../error');

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

source_dir: 'source',
public_dir: 'public',

new_post_name: ':title.md',
default_layout: 'post',
auto_spacing: false,
titlecase: false,
external_link: true,
max_open_file: 100,
multi_thread: true,
