var async = require('async'),
pathFn = require('path'),
util = require('../../util'),
yfm = util.yfm;

module.exports = function(data, callback){
var Page = hexo.model('Page'),
path = data.path,
doc = Page.findOne({source: path}),
getOutput = hexo.render.getOutput;
