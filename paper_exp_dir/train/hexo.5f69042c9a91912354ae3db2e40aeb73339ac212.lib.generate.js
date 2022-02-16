var util = require('./util'),
file = util.file,
yfm = util.yfm,
process = require('./process'),
renderFn = require('./render'),
render = renderFn.render,
renderFile = renderFn.renderFile,
model = require('./model'),
dbAssets = model.assets,
extend = require('./extend'),
renderer = extend.renderer.list(),
generator = extend.generator.list(),
route = require('./route'),
i18n = require('./i18n').i18n,
_ = require('lodash'),
async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
watchr = require('watchr'),
config = hexo.config,
baseDir = hexo.base_dir,
sourceDir = hexo.source_dir,
themeDir = hexo.theme_dir,
layoutDir = themeDir + 'layout/';

var hiddenFileRegex = /^[^\.](?:(?!\/\.).)*$/,
hiddenAdvFileRegex = /^[^_\.](?:(?!\/[_\.]).)*$/;

module.exports = function(options, callback){
var watch = options.watch,
themeConfig = {},
themeLayout = {},
themei18n = new i18n();

var afterProcess = function(callback){
async.parallel([
function(next){
hexo.db.save(next);
},
function(next){
async.forEach(generator, function(item, next){
item(model, function(layout, locals, callback){
if (!Array.isArray(layout)) layout = [layout];

var newLocals = {
page: locals,
site: model,
config: config,
theme: themeConfig,
__: themei18n.get,
layout: 'layout'
};

for (var i=0, len=layout.length; i<len; i++){
var item = layout[i];
if (themeLayout.hasOwnProperty(item)){
var layoutPath = layoutDir + item + themeLayout[item];
break;
}
}

