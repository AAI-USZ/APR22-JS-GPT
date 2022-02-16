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
auto_spacing: false,
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
},

default_category: 'uncategorized',
category_map: {},
tag_map: {},

archive: 2,
category: 2,
tag: 2,

port: 4000,
server_ip: 'localhost',
logger: false,
logger_format: 'dev',

date_format: 'MMM D YYYY',
time_format: 'H:mm:ss',

per_page: 10,
pagination_dir: 'page',

disqus_shortname: '',

theme: 'landscape',
exclude_generator: [],

deploy: {}
};

var joinPath = function(){
var str = path.join.apply(this, arguments);

if (str[str.length - 1] !== path.sep) str += path.sep;

return str;
};

module.exports = function(callback){
var baseDir = hexo.base_dir,
configPath = hexo.configfile;



hexo.config = {};

async.series([
function(next){
fs.exists(configPath, function(exist){
if (exist){
next();
} else {
callback();
}
});
},
function(next){
hexo.render.render({path: configPath}, function(err, result){
if (err) return next(HexoError.wrap(err, 'Config file load failed'));

var config = hexo.config = _.extend(defaults, result);
hexo.env.init = true;

if (_.last(config.root) !== '/'){
config.root += '/';
}

if (_.last(config.url) === '/'){
config.url = config.url.substring(0, config.url.length - 1);
}

var baseDir = hexo.base_dir;



hexo.constant('public_dir', joinPath(baseDir, config.public_dir));



hexo.constant('source_dir', joinPath(baseDir, config.source_dir));



hexo.constant('plugin_dir', joinPath(baseDir, 'node_modules'));
