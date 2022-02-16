var async = require('async'),
swig = require('swig'),
_ = require('lodash'),
isReady = false;

var rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g,
rUnescape = /<hexoescape>(\d+)<\/hexoescape>/g;

swig.setDefaults({autoescape: false});



module.exports = function(source, data, callback){
var extend = hexo.extend,
filter = extend.filter,
render = hexo.render.render;


if (!isReady){
extend.tag.list().forEach(function(tag){
swig.setTag(tag.name, tag.parse, tag.compile, tag.ends, true);
});

isReady = true;
}


var escapeContent = function(){
var indent = parseInt(arguments[2], 10),
str = arguments[3],
out = '';

out += '<hexoescape>' + cache.length + '</hexoescape>';
cache.push(str);

return out;
};

var cache = [];

async.series([

function(next){
