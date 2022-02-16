var async = require('async'),
pathFn = require('path'),
moment = require('moment'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path;

var config = hexo.config,
renderFn = hexo.render,
isRenderable = renderFn.isRenderable,
renderPost = renderFn.renderPost;

var model = hexo.model,
Post = model('Post');

var rBasename = /((.*)\/)?([^\/]+)\.(\w+)$/;

var getInfoFromFilename = function(path){
var config = config.new_post_name,
params = [];

var pattern = pathFn.basename(config, pathFn.extname(config))
.replace(/(\/|\.)/g, '\\$&')
.replace(/:(\d+)/g, function(match, name){
if (name === 'year'){
params.push(name);
return '(\\d{4})';
} else if (name === 'month' || name === 'day'){
params.push(name);
return '(\\d{2})';
} else if (name === 'title'){
params.push(name);
return '(.*)';
} else {
return '';
}
});

var regex = new RegExp('^' + pattern + '$');

if (!regex.test(path)) return;

var match = path.match(regex),
results = {};

for (var i = 1, len = match.length; i <= len; i++){
result[params[i - 1]] = match[i];
}

return result;
};

module.exports = function(data, callback){
var path = data.params.path;

if (!isRenderable(path)) return;


if (/\/_/.test(path)) return callback();


if (/[~%]$/.test(path)) return callback();

var doc = Post.findOne({source: data.path});

if (data.type === 'delete' && doc){
hexo.route.remove(doc.path);
doc.remove();

return callback();
}

async.auto({
stat: function(next){
data.stat(next);
},
read: function(next){
data.read({cache: true}, next);
}
}, function(err, results){
if (err) return callback(err);

var stat = results.stat,
meta = yfm(results.read);

meta.content = meta._content;
delete meta._content;

meta.source = data.path;
meta.raw = results.read;
