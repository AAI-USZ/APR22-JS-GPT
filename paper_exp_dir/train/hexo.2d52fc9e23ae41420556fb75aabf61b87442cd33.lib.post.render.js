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
extend.tag.list().forEach(function(tag){
swig.setTag(tag.name, tag.parse, tag.compile, tag.ends, true);
});

isReady = true;
}



var escapeContent = function(){
var indent = arguments[2],
str = arguments[3],
out = '<notextile>' + cache.length + '</notextile>\n';

cache.push(str);


if (indent){
for (var i = 0; i < indent; i++){
out += '\t';
}
}

return out;
};

var cache = [];

async.series([

function(next){
try {
data.content = swig.render(data.content, {
locals: data,
filename: source
});
} catch (err){
return callback(err);
}


data.content = data.content.replace(rEscapeContent, escapeContent);

