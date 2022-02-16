var async = require('async');

module.exports = function(data, callback){
var Page = hexo.model('Page'),
doc = Page.findOne({source: data.path}),
getOutput = hexo.render.getOutput;

if (data.type === 'delete'){
if (doc){
hexo.route.remove(path);
