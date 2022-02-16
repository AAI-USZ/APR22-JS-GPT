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

var config = hexo.config,
slug = data.slug = escape.filename(data.slug || data.title, config.filename_case),
layout = data.layout = (data.layout || config.default_layout).toLowerCase(),
date = data.date = data.date ? moment(data.date) : moment();

async.auto({
filename: function(next){
hexo.extend.filter.apply('new_post_path', [data, replace], function(err, results){
if (err) return next(err);
next(null, results[results.length - 1]);
});
},
scaffold: function(next){
hexo.scaffold.get(layout, function(err, result){
if (err) return next(err);
if (result != null) return next(null, result);

