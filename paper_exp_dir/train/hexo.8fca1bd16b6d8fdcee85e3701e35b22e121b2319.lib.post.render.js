var async = require('async'),
swig = require('swig');

var extend = hexo.extend,
filter = extend.filter.list(),
renderFn = hexo.render,
render = renderFn.render,
swigInit = false;

var rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g,
rLineBreak = /(\n(\t+)){2,}/g,
rUnescape = /<notextile>(\d+)<\/notextile>/g;

module.exports = function(source, data, callback){
if (!swigInit) swig.init({tags: extend.tag.list()});

var escapeContent = function(){
var indent = arguments[2],
str = arguments[3],
out = '<notextile>' + cache.length + '</notextile>\n';

cache.push(str);


if (indent){
for (var i = 0; i < indent; i++){
