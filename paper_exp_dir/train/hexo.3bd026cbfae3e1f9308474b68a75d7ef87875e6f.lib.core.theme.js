var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
chokidar = require('chokidar'),
_ = require('lodash'),
i18n = require('./i18n'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2;

var rHiddenFile = /^_|\/_|[~%]$/;

var themeConfig = {},
themeLayout = {},
themei18n = new i18n(),
isRunning = false,
isReady = false;

var _layoutDir = function(){
return pathFn.join(hexo.theme_dir, 'layout') + pathFn.sep;
};

var _sourceDir = function(){
return pathFn.join(hexo.theme_dir, 'source') + pathFn.sep;
};

var _languageDir = function(){
return pathFn.join(hexo.theme_dir, 'languages') + pathFn.sep;
};

var _loadConfig = function(callback){
if (typeof callback !== 'function') callback = function(){};

var configPath = pathFn.join(hexo.theme_dir, '_config.yml');

fs.exists(configPath, function(exist){
if (!exist) return callback();

hexo.render.render({path: configPath}, function(err, result){
if (err) return callback(HexoError.wrap(err, 'Theme configuration load failed'));

themeConfig = result;

hexo.log.d('Theme configuration loaded');
callback();
});
});
};

var _loadLayout = function(callback){
if (typeof callback !== 'function') callback = function(){};

var layoutDir = _layoutDir();

fs.exists(layoutDir, function(exist){
if (!exist) return callback();

file.list(layoutDir, {ignorePattern: rHiddenFile}, function(err, files){
if (err) return callback(HexoError.wrap(err, 'Theme layout load failed'));

files.forEach(function(item){
var extname = pathFn.extname(item),
name = item.substring(0, item.length - extname.length);

themeLayout[name] = extname;
});

hexo.log.d('Theme layout loaded');
callback();
});
});
};

var _processSource = function(src, callback){
if (typeof callback !== 'function') callback = function(){};

var source = pathFn.join(_sourceDir(), src),
Asset = hexo.model('Asset');

Asset.updateStat(source.substring(hexo.base_dir.length), function(err, asset){
if (err) return callback(HexoError.wrap(err, 'Theme source load failed: ' + src));

asset.path = src;
asset.save();

callback();
});
};

var _loadSource = function(callback){
if (typeof callback !== 'function') callback = function(){};
