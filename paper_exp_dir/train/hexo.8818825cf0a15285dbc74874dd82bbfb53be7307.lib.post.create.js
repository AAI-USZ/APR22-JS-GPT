

var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
moment = require('moment'),
swig = require('swig'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape.filename;

var _getFilename = function(data, replace, callback){
var sourceDir = hexo.source_dir,
layout = data.layout,
date = data.date,
slug = data.slug;

if (layout === 'page'){
var target = path.join(sourceDir, slug, 'index.md');
} else {
var filename = hexo.config.new_post_name
.replace(/:year/g, date.year())
.replace(/:month/g, date.format('MM'))
.replace(/:i_month/g, date.format('M'))
.replace(/:day/g, date.format('DD'))
.replace(/:i_day/g, date.format('D'))
.replace(/:title/g, slug);

if (!path.extname(filename)) filename += '.md';

filename = filename.replace(/\

var target = path.join(sourceDir, layout === 'draft' ? '_drafts' : '_posts', filename);
}

if (replace) return callback(null, target);

fs.exists(target, function(exist){
if (!exist) return callback(null, target);


fs.readdir(path.dirname(target), function(err, files){
if (err) return callback(err);

var extname = path.extname(target),
basename = path.basename(target, extname),
regex = new RegExp('^' + basename + '-?(\\d+)?'),
max = 0;

files.forEach(function(item){
var match = path.basename(item, path.extname(item)).match(regex);

if (match){
var num = match[1];

if (num){
if (num >= max){
max = parseInt(num) + 1;
}
} else {
if (max == 0){
max = 1;
}
}
}
});

target = target.substring(0, target.length - extname.length) + '-' + max + extname;
callback(null, target);
});
});
};

module.exports = function(data, replace, callback){
if (!callback){
if (typeof replace === 'function'){
callback = replace;
replace = false;
} else {
callback = function(){};
}
}

var slug = data.slug = escape(data.slug || data.title, hexo.config.filename_case),
layout = data.layout = (data.layout || hexo.config.default_layout).toLowerCase(),
date = data.date = data.date ? moment(data.date) : moment();

async.auto({
filename: function(next){
_getFilename(data, replace, next);
},
scaffold: function(next){
hexo.scaffold.get(layout, next);
},
content: ['filename', 'scaffold', function(next, results){
data.date = date.format('YYYY-MM-DD HH:mm:ss');

var content = swig.compile(results.scaffold)(data);

file.writeFile(results.filename, content, function(err){
if (err) return next(err);
