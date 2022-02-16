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
hexo.scaffold.get(layout, next);
},
content: ['filename', 'scaffold', function(next, results){
data.date = date.format('YYYY-MM-DD HH:mm:ss');

var content = swig.compile(results.scaffold)(data),
compiled = yfm(content);

for (var i in data){
if (preservedKeys.indexOf(i) === -1){
compiled[i] = data[i];
}
}

if (data.content){
compiled._content += '\n' + data.content;
}

content = yfm.stringify(compiled);

file.writeFile(results.filename, content, function(err){
if (err) return callback(err);

next(null, content);
});
}],
folder: ['filename', function(next, results){
if (!hexo.config.post_asset_folder) return next();

var filename = results.filename,
target = filename.substring(0, filename.length - path.extname(filename).length);

fs.exists(target, function(exist){
if (exist){
file.rmdir(target, function(err){
if (err) return next(err);

file.mkdirs(target, next);
});
} else {
file.mkdirs(target, next);
}
});
}]
}, function(err, results){
if (err) return callback(err);



hexo.emit('new', results.filename, results.content);
callback(null, results.filename, results.content);
});
};
