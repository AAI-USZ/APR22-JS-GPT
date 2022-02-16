var path = require('path'),
fs = require('graceful-fs'),
async = require('async'),
_ = require('lodash'),
HexoError = require('../error'),
Theme = require('../theme'),
Source = require('../core/source'),
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

source_dir: 'source',
public_dir: 'public',

new_post_name: ':title.md',
default_layout: 'post',
auto_spacing: false,
titlecase: false,
external_link: true,
max_open_file: 100,
multi_thread: true,
filename_case: 0,
render_drafts: false,
post_asset_folder: false,
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
server_ip: '0.0.0.0',
logger: false,
logger_format: '',

date_format: 'MMM D YYYY',
time_format: 'H:mm:ss',

per_page: 10,
pagination_dir: 'page',

disqus_shortname: '',

theme: 'landscape',
exclude_generator: [],

markdown: {
gfm: true,
pedantic: false,
sanitize: false,
tables: true,
breaks: true,
smartLists: true,
smartypants: true
},

deploy: {}
};

var joinPath = function(){
var str = path.join.apply(this, arguments);

if (str[str.length - 1] !== path.sep) str += path.sep;

return str;
};
