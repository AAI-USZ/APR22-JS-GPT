var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
route = require('../route'),
Collection = require('../model').Collection,
util = require('../util'),
file = util.file,
yfm = util.yfm,
highlight = util.highlight,
pathFn = require('path'),
sep = pathFn.sep,
fs = require('graceful-fs'),
swig = require('swig'),
async = require('async'),
moment = require('moment'),
_ = require('underscore'),
config = hexo.config,
sourceDir = hexo.source_dir,
publicDir = hexo.public_dir,
catDir = config.category_dir,
tagDir = config.tag_dir + '/',
siteUrl = config.url + '/',
configLink = config.permalink,
highlightConfig = config.highlight,
highlightEnable = highlightConfig ? highlightConfig.enable : true,
backtickConfig = highlightConfig ? highlightConfig.backtick_code_block : true,
lineNumConfig = highlightConfig ? highlightConfig.line_number : true;

swig.init({tags: tag});

if (config.new_post_name){
var configNewPostLink = config.new_post_name;

var filenameRE = pathFn.basename(configNewPostLink, pathFn.extname(configNewPostLink))
.replace(':year', '\\d{4}')
.replace(/:(month|day)/g, '\\d{2}')
.replace(':title', '(.*)');

filenameRE = new RegExp(filenameRE);
}

var load = function(source, callback){
var sourcePath = sourceDir + source;

async.parallel([
function(next){
file.read(sourcePath, next);
},
function(next){
fs.stat(sourcePath, next);
}
], function(err, results){
var meta = yfm(results[0]),
stats = results[1],
extname = pathFn.extname(sourcePath).substring(1);

meta.date = _.isDate(meta.date) ? moment(meta.date) : moment(meta.date, 'YYYY-MM-DD HH:mm:ss');
meta.stats = stats;
meta.source = sourcePath;

if (meta.updated) meta.updated = _.isDate(meta.updated) ? moment(meta.date) : moment(meta.date, 'YYYY-MM-DD HH:mm:ss');
else meta.updated = moment(stats.mtime);


var compiled = swig.compile(meta._content)();


if (highlightEnable && backtickConfig){
compiled = compiled.replace(/`{3,} *([^\n]*)?\n([\s\S]+?)\n`{3,}/g, function(match, args, str){
var options = {gutter: lineNumConfig};

if (args){
var matched = args.match(/([^\s]+)\s+(.+?)(https?:\/\/\S+)\s*(.+)?/i);

if (matched){
var lang = matched[1],
caption = '<span>' + matched[2] + '</span>';

if (matched[3]){
caption += '<a href="' + matched[3] + '">' + (matched[4] ? matched[4] : 'link') + '</a>';
}
