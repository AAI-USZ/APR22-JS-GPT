'use strict';

module.exports = {

title: 'Hexo',
subtitle: '',
description: '',
author: 'John Doe',
language: 'en',
timezone: '',

url: 'http://yoursite.com',
root: '/',
permalink: ':year/:month/:day/:title/',
permalink_defaults: {},
pretty_urls: {
trailing_index: true
},

source_dir: 'source',
public_dir: 'public',
tag_dir: 'tags',
archive_dir: 'archives',
category_dir: 'categories',
code_dir: 'downloads/code',
i18n_dir: ':lang',
skip_render: [],

new_post_name: ':title.md',
default_layout: 'post',
titlecase: false,
external_link: {
enable: true,
field: 'site',
exclude: ''
},
filename_case: 0,
render_drafts: false,
post_asset_folder: false,
relative_link: false,
future: true,
highlight: {
enable: true,
auto_detect: false,
line_number: true,
tab_replace: '',
wrap: true
},

default_category: 'uncategorized',
category_map: {},
tag_map: {},

date_format: 'YYYY-MM-DD',
time_format: 'HH:mm:ss',
