var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
moment = require('moment'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path;

var renderFn = hexo.render,
isRenderable = renderFn.isRenderable,
renderPost = renderFn.renderPost,
route = hexo.route;

var model = hexo.model,
Page = model('Page'),
Asset = model('Asset');

module.exports = function(data, callback){
var path = data.path;


if (/[~%]$/.test(path)) return callback();

if (isRenderable(path)){
var doc = Page.findOne({source: path});

if (data.type === 'delete' && doc){
route.remove(path);
doc.remove();

return callback();
}

async.auto({
stat: function(next){
data.stat(next);
},
read: function(next){
data.read({cache: true}, next);
}
}, function(err, results){
if (err) return callback(err);

var stat = results.stat,
meta = yfm(results.read);

meta.content = meta._content;
delete meta._content;

meta.source = path;
meta.raw = results.read;
