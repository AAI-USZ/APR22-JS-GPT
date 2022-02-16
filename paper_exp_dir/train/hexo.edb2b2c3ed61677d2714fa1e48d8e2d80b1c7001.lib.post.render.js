var async = require('async'),
swig = require('swig'),
_ = require('lodash'),
isReady = false;

var rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g,
rLineBreak = /(\n(\t+)){2,}/g,
rUnescape = /<notextile>(\d+)<\/notextile>/g;

swig.setDefaults({autoescape: false});



module.exports = function(source, data, callback){
var extend = hexo.extend,
filter = extend.filter.list(),
render = hexo.render.render;


if (!isReady){
