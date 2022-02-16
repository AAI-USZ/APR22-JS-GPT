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
require(path + item);
} catch (err){
item_err(err, item);
}
}
});

success();
});
});
};

module.exports = function(args){
var safe = !!args.safe,
debug = !!args.debug,
dirname = __dirname,
baseDir = process.cwd() + '/',
version = require('../package.json').version,
log = new Log({hide: debug ? 9 : 7}),
config = {};

var hexo = global.hexo = {
get base_dir(){return baseDir},
get public_dir(){return baseDir + 'public/'},
get source_dir(){return baseDir + 'source/'},
get theme_dir(){return baseDir + 'themes/' + config.theme + '/'},
get plugin_dir(){return baseDir + 'node_modules/'},
get script_dir(){return baseDir + 'scripts/'},
get scaffold_dir(){return baseDir + 'scaffolds/'},
get core_dir(){return path.dirname(dirname) + '/'},
get lib_dir(){return dirname + '/'},
get version(){return version},
get env(){return process.env},
get safe(){return safe},
get debug(){return debug},
get config(){return config},
get extend(){return extend},
get render(){return render},
get util(){return util},
get call(){return call},
get i18n(){return i18n.i18n},
get route(){return route},
get log(){return log},
get model(){return require('./model')},
get create(){return require('./create')}
};

hexo.cache = {};


hexo.__proto__ = EventEmitter.prototype;


process.on('exit', function(){
hexo.emit('exit');
