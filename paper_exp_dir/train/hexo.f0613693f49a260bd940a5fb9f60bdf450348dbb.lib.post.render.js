var async = require('async'),
swig = require('swig'),
_ = require('lodash'),
isReady = false;

var rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g,
rLineBreak = /(\n(\t+)){2,}/g,
rUnescape = /<notextile>(\d+)<\/notextile>/g;



module.exports = function(source, data, callback){
var extend = hexo.extend,
filter = extend.filter.list(),
render = hexo.render.render;


if (!isReady){
swig.init({tags: extend.tag.list()});
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
data.content = swig.compile(data.content)(data);
} catch (err){
return callback(err);
}


data.content = data.content.replace(rEscapeContent, escapeContent);

next();
},
function(next){

async.eachSeries(filter.pre, function(filter, next){
filter(data, function(err, result){
if (err) return callback(err);

if (result){

result.content = result.content.replace(rEscapeContent, escapeContent);

data = result;
}

next();
});
}, next);
},
function(next){

data.content = data.content.replace(rLineBreak, function(){
var tabs = arguments[2],
out = '\n';

for (var i = 0, len = tabs.length; i < len; i++){
out += '\t';
}

return out;
});

var options = _.extend({}, hexo.config.markdown, data.markdown);

if (!hexo.config.highlight.enable){
options.highlight = null;
}


render({text: data.content, path: source, engine: data.engine}, options, function(err, result){
if (err) return callback(err);


data.content = result.replace(rUnescape, function(match, number){
return cache[number];
});

