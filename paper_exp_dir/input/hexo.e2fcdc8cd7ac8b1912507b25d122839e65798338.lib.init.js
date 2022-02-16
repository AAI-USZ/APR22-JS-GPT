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

new_post_name: ':title.md',
default_layout: 'post',
auto_spacing: false,
titlecase: false,
max_open_file: 100,
filename_case: 0,
highlight: {
enable: true,
backtick_code_block: true,
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

module.exports = function(args){
var safe = args.safe ? true : false,
debug = args.debug ? true : false,
dirname = __dirname,
baseDir = process.cwd() + '/',
db = new Database(baseDir + 'db.json'),
version = require('../package.json').version,
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
get env(){return env},
get safe(){return safe},
get debug(){return debug},
get config(){return config},
get extend(){return extend},
get render(){return render},
get util(){return util},
get call(){return call},
get i18n(){return i18n.i18n},
get route(){return route},
get db(){return db}
};

hexo.cache = {};


hexo.__proto__ = EventEmitter.prototype;


process.on('exit', function(){
hexo.emit('exit');
});


require('./plugins/renderer');

async.auto({

config: function(next){
var configPath = baseDir + '_config.yml';
fs.exists(configPath, function(exist){
if (exist){
render.render({path: configPath}, function(err, result){
if (err) return new Error('Config compiled error');
config = _.extend(defaults, result);
Object.freeze(config);
next(null, true);
});
} else {
next(null, false);
}
});
},

update: ['config', function(next, results){
if (!results.config) return next();

var packagePath = baseDir + 'package.json';

