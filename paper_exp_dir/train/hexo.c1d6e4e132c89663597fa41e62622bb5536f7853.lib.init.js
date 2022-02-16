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
get model(){return require('./model')}
};

hexo.cache = {};


hexo.__proto__ = EventEmitter.prototype;


process.on('exit', function(){
hexo.emit('exit');
});

process.on('uncaughtException', function(err){
if (err) log.d(err);
});

var throwErr = function(err, msg){
var stack = err.stack;

err.name = 'Error';
err.message = msg;
err.stack = stack;

log.e(err);
};


require('./plugins/renderer');

async.auto({

config: function(next){
var configPath = baseDir + '_config.yml';

fs.exists(configPath, function(exist){
if (!exist) return next(null, false);

render.render({path: configPath}, function(err, result){
if (err) throw throwErr(err, 'Configuration file load failed');

config = _.extend(defaults, result);

log.d('Configuration file loaded successfully');
next(null, true);
});
});
},

update: ['config', function(next, results){
if (!results.config) return next();

var packagePath = baseDir + 'package.json';

async.waterfall([

function(next){
fs.exists(packagePath, function(exist){
next(null, exist);
});
},

function(exist, next){
if (exist){
var obj = require(packagePath);

if (version === obj.version) return next(null, false);

obj.version = version;
} else {
var obj = {
name: 'hexo',
version: version,
private: true,
dependencies: {}
};
}

fs.writeFile(packagePath, JSON.stringify(obj, null, '  '), function(err){
next(err, exist);
});
},

function(old, next){
if (!old) return next();

var dbPath = baseDir + 'db.json';

fs.exists(dbPath, function(exist){
if (!exist) return next();

fs.unlink(dbPath, next);
});
}
], function(err){
if (err) throw throwErr(err, 'Version information check failed');

log.d('Version information checked successfully');
next();
});
}],

load_plugins: ['config', function(next, results){
if (safe || !results.config) return next();

loadScripts(baseDir + 'node_modules/',

function(err){
throw throwErr(err, 'Plugins load failed');
},

function(err, item){
var info = 'Plugin load failed: ' + item;

if (debug){
throw throwErr(err, info);
} else {
return throwErr(err, info);
}
}, function(err){
if (err) throw throwErr(err, 'Plugins load failed');

log.d('Plugins loaded successfully');
next();
});
}],

load_scripts: ['config', function(next, results){
if (safe || !results.config) return next();

loadScripts(baseDir + 'scripts/',

function(err){
throw throwErr(err, 'Scripts load failed');
},

function(err, item){
var info = 'Script load failed: ' + item;

if (debug){
throw throwErr(err, info);
} else {
return throwErr(err, info);
}
}, function(err){
if (err) throw throwErr(err, 'Scripts load failed');

log.d('Scripts loaded successfully');
next();
});
}]
}, function(err, results){
if (err) return log.e(err);

var init = results.config;

if (init){

require('./model/post');
require('./model/page');
require('./model/category');
require('./model/tag');
require('./model/asset');
require('./model/cache');


require('./plugins/tag');
require('./plugins/deployer');
require('./plugins/processor');
require('./plugins/helper');
require('./plugins/filter');
require('./plugins/generator');
}


require('./plugins/console');

var list = extend.console.list(),
command = args._[0] ? args._.shift().toLowerCase() : '',
arr = [];


_.each(list, function(val, key){
var options = val.options || {};

if ((!init && !options.init) || (!debug && options.debug)){
delete list[key];
} else {
arr[key] = val;

if (options.alias){
arr[options.alias] = val;
}
}
});

if (Object.keys(arr).indexOf(command) > -1){
hexo.emit('ready');

arr[command](args, function(){
process.exit();
});
} else {
var maxLen = 4,
result = 'Usage: hexo <command>\n\nCommands:\n';

var helps = [];

_.each(list, function(val, key){
helps.push([key, val.description]);
});

helps = helps.sort(function(a, b){
var orderA = a[0],
orderB = b[0];

if (orderA.length >= orderB.length && maxLen < orderA.length) maxLen = orderA.length;
else if (maxLen < orderB.length) maxLen = orderB.length;

if (orderA < orderB) return -1;
else if (orderA > orderB) return 1;
else return 0;
});

helps.forEach(function(item){
result += '  ' + item[0].bold;

for (var i = 0; i < maxLen + 3 - item[0].length; i++){
result += ' ';
}

result += item[1] + '\n';
});

console.log(result);
}
});
};
