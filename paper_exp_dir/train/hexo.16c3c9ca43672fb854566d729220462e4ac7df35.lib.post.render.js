var async = require('async'),
swig = require('swig'),
_ = require('lodash'),
isReady = false;

var rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g,
rUnescape = /<hexoescape>(\d+)<\/hexoescape>/g;

swig.setDefaults({autoescape: false});



module.exports = function(source, data, callback){
var extend = hexo.extend,
filter = extend.filter.list(),
render = hexo.render.render;

