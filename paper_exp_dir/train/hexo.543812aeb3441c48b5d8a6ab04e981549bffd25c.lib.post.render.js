var async = require('async'),
swig = require('swig'),
_ = require('lodash'),
isReady = false;

var rEscapeContent = /<escape>([\s\S]+?)<\/escape>/g,
rLineBreak = /(\n(\t+)){2,}/g,
rUnescape = /<notextile>(\d+)<\/notextile>/g;

swig.setDefaults({autoescape: false});



module.exports = function(source, data, callback){
var extend = hexo.extend,
filter = extend.filter.list(),
render = hexo.render.render;


if (!isReady){
extend.tag.list().forEach(function(tag){
swig.setTag(tag.name, tag.parse, tag.compile, tag.ends, true);
});

isReady = true;
}


var escapeContent = function(){
var str = arguments[1],
out = '<notextile>' + cache.length + '</notextile>\n';

cache.push(str);

return out;
};

var cache = [];

