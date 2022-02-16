var async = require('async'),
pathFn = require('path'),
moment = require('moment'),
util = require('../../util'),
yfm = util.yfm;

module.exports = function(data, callback){
var Page = hexo.model('Page'),
path = data.path,
doc = Page.findOne({source: path}),
getOutput = hexo.render.getOutput;

if (data.type === 'skip' && doc){
return callback();
}

if (data.type === 'delete'){
if (doc){
hexo.route.remove(doc.path);
doc.remove();
