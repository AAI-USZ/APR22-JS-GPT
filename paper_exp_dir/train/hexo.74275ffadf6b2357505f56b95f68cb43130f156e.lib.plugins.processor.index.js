var fs = require('graceful-fs'),
pathFn = require('path'),
swig = require('swig'),
moment = require('moment'),
_ = require('lodash'),
async = require('async'),
extend = require('../../extend'),
tagExt = extend.tag.list(),
filterExt = extend.filter.list(),
renderFn = require('../../render'),
render = renderFn.render,
isRenderable = renderFn.isRenderable,
route = require('../../route'),
HexoError = require('../../error'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path,
config = hexo.config,
newPostConfig = config.new_post_name,
filenameCaps = config.filename_case,
log = hexo.log,
model = hexo.model,
Post = model('Post'),
Page = model('Page'),
Asset = model('Asset'),
rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g;

swig.init({tags: tagExt});

if (newPostConfig){
var filenameRE = pathFn.basename(newPostConfig, pathFn.extname(newPostConfig))
.replace(/:year/g, '(\\d{4})')
.replace(/:(month|day)/g, '(\\d{2})')
.replace(/:title/g, '(.*)');

filenameRE = new RegExp(filenameRE);
var filenameArr = _.map(newPostConfig.match(/:[a-z]+/g), function(item){
return item.substring(1);
});
}

var getInfoFromFilename = function(str){
if (!filenameRE.test(str)) return;

var meta = str.match(filenameRE).slice(1),
result = {};

for (var i=0, len=filenameArr.length; i<len; i++){
result[filenameArr[i]] = meta[i];
}

return result;
};

var load = function(file, callback){
var source = file.source,
path = file.path;

async.parallel([
function(next){
file.read({cache: true}, next);
},
function(next){
file.stat(next);
}
], function(err, results){
if (err) return callback(HexoError('Source file read failed: ' + source));

var content = results[0],
stat = results[1],
meta = yfm(content);

meta.source = path;
meta.original_content = content;
meta.mtime = stat.mtime;
meta.ctime = stat.ctime;
if (meta.date && !_.isDate(meta.date)) meta.date = moment(meta.date, 'YYYY-MM-DD HH:mm:ss').toDate();
if (meta.updated){
if (!_.isDate(meta.updated)) meta.updated = moment(meta.updated, 'YYYY-MM-DD HH:mm:ss').toDate();
} else {
meta.updated = stat.mtime;
}

var cache = [],
length = 0;

meta.content = swig.compile(meta._content)();
delete meta._content;

var escapeContent = function(match, indentWrap, indent, str){
var out = '<notextile>' + length++ + '</notextile>\n';

cache.push(str);


if (indent){
for (var i = 0; i < indent; i++){
out += '\t';
}
}

return out;
};


meta.content = meta.content.replace(rEscapeContent, escapeContent);

filterExt.pre.forEach(function(filter){
var result = filter(meta);

if (result){
result.content = result.content.replace(rEscapeContent, escapeContent);

meta = result;
}
});


meta.content = meta.content.replace(/(\n(\t+)){2,}/g, function(){
var tabs = arguments[2],
out = '\n';

for (var i = 0, len = tabs.length; i < len; i++){
out += '\t';
}

return out;
});


