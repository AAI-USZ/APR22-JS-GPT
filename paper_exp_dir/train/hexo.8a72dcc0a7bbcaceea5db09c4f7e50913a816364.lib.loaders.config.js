var path = require('path'),
fs = require('graceful-fs'),
async = require('async'),
_ = require('lodash'),
HexoError = require('../error'),
Theme = require('../theme'),
Source = require('../core/source'),
Scaffold = require('../core/scaffold'),
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

var baseDir = hexo.base_dir;



hexo.constant('public_dir', joinPath(baseDir, config.public_dir));



hexo.constant('source_dir', joinPath(baseDir, config.source_dir));



hexo.constant('plugin_dir', joinPath(baseDir, 'node_modules'));



hexo.constant('script_dir', joinPath(baseDir, 'scripts'));



hexo.constant('scaffold_dir', joinPath(baseDir, 'scaffolds'));



hexo.constant('theme_dir', function(){
return joinPath(baseDir, 'themes', config.theme);
});



hexo.constant('theme_script_dir', function(){
return joinPath(hexo.theme_dir, 'scripts');
});

next();
});
},
function(next){
fs.exists(hexo.theme_dir, function(exist){
if (exist){

hexo.theme = new Theme();
next();
} else {
next(new Error('Theme ' + hexo.config.theme + ' does not exist.'));
}
});
},
function(next){
fs.exists(hexo.source_dir, function(exist){

hexo.source = new Source();

if (exist){
next();
} else {
file.mkdirs(hexo.source_dir, next);
}
});
},
function(next){
fs.exists(hexo.scaffold_dir, function(exist){

hexo.scaffold = new Scaffold();

if (exist){
hexo.scaffold.process(next);
} else {
file.mkdirs(hexo.scaffold_dir, function(err){
if (err) return next(err);

hexo.scaffold.process(next);
});
}
});
}
], function(err){
if (err) return callback(err);

hexo.log.d('Config file loaded from %s', configPath);
callback();
});
};
