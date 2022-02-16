var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
moment = require('moment'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path;

var renderFn = hexo.render,
isRenderable = renderFn.isRenderable,
route = hexo.route;

var model = hexo.model,
Page = model('Page'),
Asset = model('Asset');

module.exports = function(data, callback){
var path = data.path;


if (/[~%]$/.test(path)) return callback();
