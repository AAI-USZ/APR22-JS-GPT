var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
util = require('../util'),
file = util.file,
yfm = util.yfm,
path = require('path'),
fs = require('fs'),
async = require('async'),
swig = require('swig'),
_ = require('underscore');

swig.init({tags: tag});

var load = function(source, callback){
var extname = path.extname(source),
moment = require('../moment');

async.waterfall([
function(next){
file.read(source, function(err, result){
if (err) throw err;

fs.stat(source, function(err, stats){
if (err) throw err;
next(null, result, stats);
});
});
},
function(file, stats, next){
var meta = yfm(file);

meta.date = _.isDate(meta.date) ? moment(meta.date) : moment(meta.date, 'YYYY-MM-DD HH:mm:ss');
meta.updated = moment(stats.mtime);
meta.stats = stats;

var compiled = swig.compile(meta._content)();

render.render(compiled, extname.substring(1), function(err, result){
if (err) throw err;

delete meta._content;
meta.content = result.replace(/<\/?notextile>/g, '');

callback(meta);
});
}
]);
};

var loadPost = function(source, category, callback){
var config = hexo.config,
extname = path.extname(source),
filename = path.basename(source, extname);

load(source, function(meta){
if (_.isArray(meta.tags)){
meta.tags = _.map(meta.tags, function(item){
return {
name: item,
permalink: config.tag_dir + '/' + item + '/'
};
});
} else if (meta.tags) {
var postTag = meta.tags.toString();
meta.tags = [{name: postTag, permalink: config.tag_dir + '/' + postTag + '/'}];
}

if (category){
var categories = category.split(path.sep);

meta.categories = [];

_.each(categories, function(item, i){
meta.categories.push({
name: item,
permalink: categories.slice(0, i + 1).join('/') + '/'
});
});
}

var date = meta.date;

if (!path.extname(config.permalink) && config.permalink.substr(config.permalink.length - 1, 1) !== '/') config.permalink += '/';

meta.permalink = config.permalink
.replace(/:category/, category ? category : config.category_dir)
.replace(/:year/, date.format('YYYY'))
.replace(/:month/, date.format('MM'))
.replace(/:day/, date.format('DD'))
.replace(/:title/, filename);

callback(meta);
