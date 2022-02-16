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
