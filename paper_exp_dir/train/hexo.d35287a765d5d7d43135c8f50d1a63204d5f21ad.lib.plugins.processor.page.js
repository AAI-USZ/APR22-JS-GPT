var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
moment = require('moment'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path;

module.exports = function(data, callback){
var renderFn = hexo.render,
isRenderable = renderFn.isRenderable,
getOutput = renderFn.getOutput,
route = hexo.route;

var model = hexo.model,
Page = model('Page'),
Asset = model('Asset');

var path = data.path,
extname = pathFn.extname(path),
doc;


if (/[~%]$/.test(path)) return callback();

if (isRenderable(path)){
doc = Page.findOne({source: path});

if (data.type === 'delete' && doc){
route.remove(path);
