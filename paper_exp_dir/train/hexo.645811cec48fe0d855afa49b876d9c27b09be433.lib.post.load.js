var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
watch = require('watch'),
util = require('../util'),
file = util.file2,
i18n = require('../i18n'),
HexoError = require('../error'),
process = require('./process');

var extend = hexo.extend,
generators = extend.generator.list();

var renderFn = hexo.render,
render = renderFn.render,
renderFile = renderFn.renderFile,
isRenderable = renderFn.isRenderable,
getOutput = renderFn.getOutput;

var model = hexo.model,
Asset = model('Asset'),
Cache = model('Cache');

var log = hexo.log,
config = hexo.config,
route = hexo.route,
baseDir = hexo.base_dir;

var rHiddenFile = /^(_|\.)|[~%]$/;

module.exports = function(options, callback){
if (!callback){
callback = options;
options = {};
}

var options = _.extend({
watch: false
}, options);

var themeDir = hexo.theme_dir,
themeConfig = _.clone(config),
themeLayout = {},
themei18n = new i18n();

async.auto({
config: function(next){
var configPath = pathFn.join(themeDir, '_config.yml');

fs.exists(configPath, function(exist){
if (!exist) return next();

render({path: configPath}, function(err, result){
if (err) return callback(HexoError.wrap(err, 'Theme configuration load failed'));

_.extend(themeConfig, result);
hexo.theme_config = themeConfig;

log.d('Theme configuration loaded');
next();
});
});
},
layout: function(next){
var layoutDir = pathFn.join(themeDir, 'layout');

fs.exists(layoutDir, function(exist){
if (!exist) return next(null, false);

file.list(layoutDir, {ignorePattern: rHiddenFile}, function(err, files){
if (err) return callback(HexoError.wrap(err, 'Theme layout load failed'));

files.forEach(function(item){
var extname = pathFn.extname(item),
name = item.substring(0, item.length - extname.length);

themeLayout[name] = extname;
});

log.d('Theme layout loaded');
next(null, true);
});
});
},
watchLayout: ['layout', function(next, results){
if (!options.watch || !results.layout) return next();

var layoutDir = pathFn.join(themeDir, 'layout');

log.d('Start watching theme layout...');

watch.watchTree(layoutDir, {
ignoreDotFiles: true,
interval: 1000,
filter: function(src){
return rHiddenFile.test(src.substring(layoutDir.length + 1));
}
}, function(src, curr, prev){
if (typeof src === 'object' && prev == null && curr == null) return next();
if (curr.isDirectory()) return;

var extname = pathFn.extname(src),
name = src.substring(layoutDir.length + 1, src.length - extname.length);

if (prev == null){
themeLayout[name] = extname;
log.log('created', 'Theme layout:', name);
} else if (curr.nlink == 0){
delete themeLayout[name];
