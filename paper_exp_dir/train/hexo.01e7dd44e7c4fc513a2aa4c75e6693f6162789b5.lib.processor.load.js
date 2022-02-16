

var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
util = require('../util'),
file = util.file,
yfm = util.yfm,
highlight = util.highlight,
path = require('path'),
fs = require('fs'),
async = require('async'),
swig = require('swig'),
_ = require('underscore'),
config = hexo.config;

swig.init({tags: tag});

var regex = {
codeBlock: /`{3} *([^\n]+)?\n(.+?)\n`{3}/,
AllOptions: /([^\s]+)\s+(.+?)(https?:\/\/\S+)\s*(.+)?/i,
LangCaption: /([^\s]+)\s*(.+)?/i
};

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
meta.stats = stats;
meta.source = source;

if (meta.updated) meta.updated = _.isDate(meta.updated) ? moment(meta.date) : moment(meta.date, 'YYYY-MM-DD HH:mm:ss');
else meta.updated = moment(stats.mtime);

var compiled = swig.compile(meta._content)().replace(regex.codeBlock, function(match, args, str){
if (!args) return match;

var captionPart = args.match(regex.AllOptions);
if (captionPart){
var lang = captionPart[1],
caption = '<span>' + captionPart[2] + '</span><a href="' + captionPart[3] + '">' + (captionPart[4] ? captionPart[4] : 'link') + '</a>';
} else {
var captionPart = args.match(regex.LangCaption);

if (!captionPart[2]) return match;

if (captionPart){
var lang = captionPart[1],
caption = '<span>' + captionPart[2] + '</span>';
}
}

return '<notextile>' + highlight(str, {lang: lang, caption: caption}) + '</notextile>';
});

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
var extname = path.extname(source),
filename = path.basename(source, extname);

load(source, function(meta){
if (_.isArray(meta.tags)){
meta.tags = _.map(meta.tags, function(item){
var tagPath = config.tag_dir + '/' + item + '/';

return {
name: item,
path: tagPath,
permalink: config.url + '/' + tagPath
};
});
} else if (meta.tags) {
