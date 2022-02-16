var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
moment = require('moment'),
swig = require('swig'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape;

swig.setDefaults({
autoescape: false
});

var _getFilename = function(data, replace, callback){
var sourceDir = hexo.source_dir,
layout = data.layout,
date = data.date,
slug = data.slug,
target = '';

if (layout === 'page'){
if (data.path){
target = path.join(sourceDir, data.path);
} else {
target = path.join(sourceDir, slug, 'index.md');
}
} else {
var postDir = path.join(sourceDir, layout === 'draft' ? '_drafts' : '_posts'),
filename = '';

if (data.path){
filename = data.path;
} else {
filename = hexo.config.new_post_name
.replace(/:year/g, date.year())
.replace(/:month/g, date.format('MM'))
.replace(/:i_month/g, date.format('M'))
.replace(/:day/g, date.format('DD'))
.replace(/:i_day/g, date.format('D'))
.replace(/:title/g, slug);

filename = filename.replace(/\
}

target = path.join(postDir, filename);
}

if (!path.extname(target)) target += '.md';

if (replace) return callback(null, target);

fs.exists(target, function(exist){
if (!exist) return callback(null, target);


fs.readdir(path.dirname(target), function(err, files){
if (err) return callback(err);

var extname = path.extname(target),
basename = path.basename(target, extname),
regex = new RegExp('^' + escape.regex(basename) + '-?(\\d+)?'),
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
if (max === 0){
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

var slug = data.slug = escape.filename(data.slug || data.title, hexo.config.filename_case),
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

if (data.content){
content += '\n' + data.content;
}

file.writeFile(results.filename, content, function(err){
if (err) return next(err);

next(null, content);
});
}],
