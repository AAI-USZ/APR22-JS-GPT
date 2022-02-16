var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
moment = require('moment'),
swig = require('swig'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape;

var preservedKeys = ['title', 'slug', 'path', 'layout', 'date', 'content'];

swig.setDefaults({
autoescape: false
});



module.exports = function(data, replace, callback){
if (!callback){
if (typeof replace === 'function'){
callback = replace;
replace = false;
} else {
callback = function(){};
}
}

var slug = data.slug = escape.filename(data.slug || data.title, hexo.config.filename_case),
layout = data.layout = (data.layout || hexo.config.default_layout).toLowerCase(),
date = data.date = data.date ? moment(data.date) : moment();

async.auto({
filename: function(next){
hexo.extend.filter.apply('new_post_path', [data, replace], next);
},
scaffold: function(next){
hexo.scaffold.get(layout, function(err, result){
if (err) return next(err);
if (result != null) return next(null, result);

hexo.scaffold.get('normal', next);
});
},
content: ['filename', 'scaffold', function(next, results){
data.title = '"' + data.title + '"';
data.date = date.format('YYYY-MM-DD HH:mm:ss');

var split = yfm.split(results.scaffold),
frontMatter = swig.compile(split.data)(data),
compiled = yfm([frontMatter, '---', split.content].join('\n'));

for (var i in data){
if (!~preservedKeys.indexOf(i)){
compiled[i] = data[i];
}
}

if (data.content){
