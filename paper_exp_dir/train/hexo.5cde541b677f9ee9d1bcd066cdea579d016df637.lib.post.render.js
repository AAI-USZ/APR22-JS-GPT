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

if (indent){
for (var i = 0; i < indent; i++){
out += '\t';
}
}

out += '\n\n<hexoescape>' + cache.length + '</hexoescape>\n\n';
cache.push(str);

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
var options = data.markdown || {};

if (!hexo.config.highlight.enable){
options.highlight = null;
}


render({text: data.content, path: source, engine: data.engine}, options, function(err, result){
if (err) return callback(err);


data.content = result.replace(rUnescape, function(match, number){
return cache[number];
});


async.eachSeries(filter.post, function(filter, next){
filter(data, function(err, result){
if (err) return callback(err);

if (result){
data = result;
}

next();
});
}, next);
});
}
], function(err){
callback(err, data);
});
};
