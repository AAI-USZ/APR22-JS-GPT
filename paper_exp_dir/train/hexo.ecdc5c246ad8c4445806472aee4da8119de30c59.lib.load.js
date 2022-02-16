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

