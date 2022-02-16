var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
watchr = require('watchr'),
_ = require('lodash'),
util = require('./util'),
file = util.file2,
yfm = util.yfm,
extend = require('./extend'),
generators = extend.generator.list(),
process = require('./process'),
renderFn = require('./render'),
render = renderFn.render,
renderFile = renderFn.renderFile,
isRenderable = renderFn.isRenderable,
getOutput = renderFn.getOutput,
i18n = require('./i18n').i18n,
route = require('./route'),
HexoError = require('./error'),
log = hexo.log,
config = hexo.config,
urlConfig = config.url,
rootConfig = config.root,
baseDir = hexo.base_dir,
sourceDir = hexo.source_dir,
themeDir = hexo.theme_dir,
layoutDir = themeDir + 'layout/',
model = hexo.model,
Asset = model('Asset'),
Cache = model('Cache');

var rHiddenFile = /^(_|\.)/;

module.exports = function(options, callback){
if (_.isFunction(options)){
callback = options;
options = {};
}

options = _.defaults(options, {
theme_watch: false,
source_watch: false
});

var themeWatch = options.theme_watch,
sourceWatch = options.source_watch,
themeConfig = {},
themeLayout = {},
themei18n = new i18n();

async.parallel([

function(next){
var path = themeDir + '_config.yml';

fs.exists(path, function(exist){
if (!exist) return next();

render({path: path}, function(err, result){
if (err) return callback(HexoError(err, 'Theme configuration file load failed'));

themeConfig = result;

log.d('Theme configuration file loaded successfully');
next();
})
});
},

function(next){
fs.exists(layoutDir, function(exist){
if (!exist) return next();

file.list(layoutDir, {ignorePattern: rHiddenFile}, function(err, files){
if (err) return callback(HexoError(err, 'Theme layout folder load failed'));

files.forEach(function(item){
var extname = pathFn.extname(item),
name = item.substring(0, item.length - extname.length);

themeLayout[name] = extname;
});

if (themeWatch){
watchr.watch({
path: layoutDir,
ignoreHiddenFiles: true,
ignoreCustomPatterns: rHiddenFile,
listener: function(type, source){
source = source.replace(/\\/g, '/');

var extname = pathFn.extname(source),
name = source.substring(layoutDir.length, source.length - extname.length);

if (type === 'delete'){
log.d('Theme layout file deleted: ' + source);
delete themeLayout[name];
} else {
log.d('Theme layout file updated: ' + source);
themeLayout[name] = extname;
}
}
});
}

log.d('Theme layout files loaded successfully');
next();
});
});
},

function(next){
var sourceDir = themeDir + 'source/';

fs.exists(sourceDir, function(exist){
if (!exist) return next();

file.list(sourceDir, {ignorePattern: rHiddenFile}, function(err, files){
if (err) return callback(HexoError(err, 'Theme source folder load failed'));

async.forEach(files, function(item, next){
themeSourceProcess(item, next);
}, function(){
if (themeWatch){
watchr.watch({
path: sourceDir,
ignoreHiddenFiles: true,
ignoreCustomPattern: rHiddenFile,
listener: function(type, source){
source = source.replace(/\\/g, '/');

var path = source.substring(sourceDir.length);

if (type === 'delete'){
var data = Asset.findOne({source: source.substring(baseDir.length)});

if (data) Asset.remove(data._id);
route.remove(path);
log.d('Theme source file deleted: ' + source);
} else {
themeSourceProcess(path, function(){
log.d('Theme source file updated: ' + source);
});
}
}
});
}

log.d('Theme source files loaded successfully');
next();
});
});
});
},

function(next){
var langDir = themeDir + 'languages';

fs.exists(langDir, function(exist){
if (!exist) return next();

themei18n.load(langDir, function(err){
if (err) return callback(HexoError(err, 'Theme i18n file load failed'));

log.d('Theme i18n file loaded successfully');
next();
});


});
},

function(next){
file.list(sourceDir, function(err, files){
if (err) return callback(HexoError(err, 'Source folder load failed'));

log.d('Source folder loaded successfully');
process(files, next);
});
}
], function(err){
if (err) return callback(err);

postProcess(function(){
callback();

if (sourceWatch){
var arr = [],
timer;

var timerFn = function(){
if (arr.length){
process(arr, postProcess);
arr = [];
}
};

watchr.watch({
path: sourceDir,
ignoreHiddenFiles: true,
listener: function(type, source){
var path = source.substring(sourceDir.length).replace(/\\/g, '/');

if (type === 'delete'){
log.i('Deleted: ' + path);
} else {
log.i('Updated: ' + path);
}

clearTimeout(timer);
arr.push({type: type, path: path});
timer = setTimeout(timerFn, 100);
