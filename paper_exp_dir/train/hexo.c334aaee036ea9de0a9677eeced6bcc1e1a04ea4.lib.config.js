var fs = require('graceful-fs'),
async = require('async'),
path = require('path'),
sep = path.sep,
yaml = require('yamljs'),
EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
cache = require('./cache'),
i18n = require('./i18n'),
util = require('./util'),
file = util.file;

module.exports = function(root, options, callback){
async.parallel([
function(next){
file.read(__dirname + '/../package.json', next);
},
function(next){
cache.init(root, next);
},
function(next){
fs.exists(root + '/_config.yml', function(exist){
if (exist){
file.read(root + '/_config.yml', function(err, content){
if (err) throw new Error('Failed to read file: ' + root + '/_config.yml');
next(null, yaml.parse(content));
});
} else {
next(null, '');
}
});
}
], function(err, result){
if (err) throw new Error('Initialize Error');

var version = JSON.parse(result[0]).version,
config = result[2],
env = process.env,
themeDir = config ? root + sep + 'themes' + sep + config.theme + sep : null,
newConfig = {},
safe = options.safe ? true : false,
debug = options.debug ? true : false;

var hexo = global.hexo = new EventEmitter();

hexo.__defineGetter__('base_dir', function(){return root + sep});
hexo.__defineGetter__('public_dir', function(){return root + sep + 'public' + sep});
hexo.__defineGetter__('source_dir', function(){return root + sep + 'source' + sep});
if (themeDir) hexo.__defineGetter__('theme_dir', function(){return themeDir});
hexo.__defineGetter__('plugin_dir', function(){return root + sep + 'node_modules' + sep});
