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

var rHiddenFile = /^_|\/_|[~%]$/;

var watchCallback = function(next, callback){
return function(src, curr, prev){
if (typeof src === 'object' && prev == null && curr == null) return next();
if ((curr && curr.isDirectory()) || (prev && prev.isDirectory())) return;

if (prev == null){
callback('create', src);
} else if (curr.nlink == 0){
callback('delete', src);
} else {
