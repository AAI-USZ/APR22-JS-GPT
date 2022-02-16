

var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
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

var sourceDir = _sourceDir();

fs.exists(sourceDir, function(exist){
if (!exist) return callback();

file.list(sourceDir, {ignorePattern: rHiddenFile}, function(err, files){
if (err) return callback(HexoError.wrap(err, 'Theme source load failed'));

async.each(files, function(item, next){
_processSource(item, next);
}, function(err){
if (err) return callback(err);

hexo.log.d('Theme source loaded');
callback();
});
});
});
};

var _loadi18n = function(callback){
if (typeof callback !== 'function') callback = function(){};

var langDir = _languageDir();

fs.exists(langDir, function(exist){
if (!exist) return callback();

themei18n.load(langDir, function(err){
if (err) return callback(HexoError.wrap(err, 'Theme language files load failed'));

hexo.log.d('Theme language files loaded');
callback();
})
});
};

exports.load = function(callback){
if (typeof callback !== 'function') callback = function(){};
if (isRunning || isReady) return callback();

isRunning = true;

async.parallel([
function(next){
_loadConfig(next);
},
function(next){
_loadLayout(next);
},
function(next){
_loadSource(next);
},
function(next){
_loadi18n(next);
}
], function(err){
isRunning = false;

if (err) return callback(err);

isReady = true;

callback();
});
};

var _watchConfig = function(type, src, stats){
_loadConfig();
};

var _watchLayout = function(type, src, stats){
var extname = pathFn.extname(src),
name = src.substring(_layoutDir().length, src.length - extname.length);

if (type === 'delete'){
delete themeLayout[name];
} else {
themeLayout[name] = extname;
}
};

var _watchSource = function(type, src, stats){
var source = src.substring(_sourceDir().length),
Asset = hexo.model('Asset');

if (type === 'delete'){
var data = Asset.findOne({
source: src.substring(hexo.base_dir.length)
});

if (data) data.remove();
route.remove(source);
hexo.log.log('delete', 'Theme source: %s', source);
} else {
_processSource(source, function(err){
if (err) return hexo.log.e(err);

hexo.log.log(type, 'Theme source: %s', source);
});
}
};

var _watchi18n = function(type, src, stats){

};



exports.watch = function(){
if (!isReady) return;

file.watch(hexo.theme_dir, {ignorePattern: rHiddenFile}, function(type, src, stats){
if (type === 'error'){
hexo.log.e('Theme watch error: ' + src);
}

var _src = src.substring(hexo.theme_dir.length);

if (_src === '_config.yml'){
_watchConfig(type, src, stats);
} else if (/^layout\
_watchLayout(type, src, stats);
} else if (/^source\
_watchSource(type, src, stats);
} else if (/^languages\
_watchi18n(type, src, stats);
