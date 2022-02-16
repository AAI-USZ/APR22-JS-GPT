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
hexo.theme_config = themeConfig;

log.d('Theme configuration loaded', result);
next();
});
});
},
layout: function(next){
var layoutDir = pathFn.join(themeDir, 'layout');

fs.exists(layoutDir, function(exist){
