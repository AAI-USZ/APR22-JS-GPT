var async = require('async'),
pathFn = require('path'),
util = require('../../util'),
yfm = util.yfm;

module.exports = function(data, callback){
var Page = hexo.model('Page'),
path = data.path,
doc = Page.findOne({source: path}),
getOutput = hexo.render.getOutput;

if (data.type === 'delete'){
if (doc){
hexo.route.remove(path);
doc.remove();
}

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
link = '',
meta;

try {
meta = yfm(results.read);
} catch (e){
return callback(e);
}

meta.content = meta._content;
