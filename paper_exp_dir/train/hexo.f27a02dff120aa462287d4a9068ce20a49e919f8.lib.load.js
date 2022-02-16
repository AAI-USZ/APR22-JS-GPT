var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
util = require('./util'),
file = util.file2,
i18n = require('./i18n'),
HexoError = require('./error'),
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
route = hexo.route;

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

log.d('Theme configuration loaded', result);
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

log.d('Theme layout loaded', themeLayout);
next(null, true);
});
});
},
watchLayout: ['layout', function(next, results){
if (!options.watch || !results.layout) return next();

var layoutDir = pathFn.join(themeDir, 'layout');

log.d('Start watching theme layout...');

file.watch(layoutDir, {
ignorePattern: rHiddenFile,
listener: function(type, src){
var extname = pathFn.extname(src),
name = src.substring(0, extname.length);

if (type === 'delete'){
delete themeLayout[name];
log.log('deleted', 'Theme layout:', src);
} else {
themeLayout[name] = extname;
log.log('updated', 'Theme layout:', src);
}
},
next: next
});
}],
source: function(next){
var sourceDir = pathFn.join(themeDir, 'source');

fs.exists(sourceDir, function(exist){
if (!exist) return next(null, false);

file.list(sourceDir, {ignorePattern: rHiddenFile}, function(err, files){
if (err) return callback(HexoError.wrap(err, 'Theme source load failed'));

async.forEach(files, function(item, next){
themeSourceProcess(item, next);
}, function(){
log.d('Theme source loaded', files);
next(null, true);
});
});
});
},
watchSource: ['source', function(next, results){
if (!options.watch || !results.source) return next();

var sourceDir = pathFn.join(themeDir, 'source');

log.d('Start watching theme source...');

file.watch(sourceDir, {
ignorePattern: rHiddenFile,
listener: function(type, src){
if (type === 'delete'){
var data = Asset.findOne({source: pathFn.join('themes', config.theme, path)});

if (data) data.remove();
route.remove(src);
log.log('deleted', 'Theme source:', src);
} else {
themeSourceProcess(src, function(err){
if (err) return log.e(err);

log.log('updated', 'Theme source:', src);
});
}
}
});
}],
i18n: function(next){
var langDir = pathFn.join(themeDir, 'languages');

fs.exists(langDir, function(exist){
if (!exist) return next();

themei18n.load(langDir, function(err){
if (err) return callback(HexoError.wrap(err, 'Theme i18n load failed'));

log.d('Theme i18n loaded: ' + Object.keys(themei18n.store));
next();
});
});
},
process: function(next){
var sourceDir = hexo.source_dir;

file.list(sourceDir, {ignorePattern: /[~%]$/}, function(err, files){
if (err) return callback(HexoError.wrap(err, 'Source load failed'));

process(files, function(err){
if (err) return callback(err);

next();
});
});
}
}, function(err){
if (err) return callback(err);

postProcess(function(err){
if (err) return callback(err);

callback();
