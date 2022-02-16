var fs = require('graceful-fs'),
pathFn = require('path'),
sep = pathFn.sep,
swig = require('swig'),
moment = require('moment'),
_ = require('underscore'),
extend = require('../../extend'),
renderer = Object.keys(extend.renderer.list()),
tagExt = extend.tag.list(),
render = require('../../render'),
route = require('../../route'),
model = require('../../model'),
dbPosts = model.posts,
dbPages = model.pages,
dbCats = model.categories,
dbTags = model.tags,
dbAssets = model.assets,
util = require('../../util'),
yfm = util.yfm,
titlecase = util.titlecase,
highlight = util.highlight,
config = hexo.config,
catDir = (config.category_dir || 'categories') + '/',
tagDir = (config.tag_dir || 'tags') + '/',
siteUrl = config.url + '/',
configLink = config.permalink,
highlightConfig = config.highlight,
highlightEnable = highlightConfig ? highlightConfig.enable : true,
backtickConfig = highlightConfig ? highlightConfig.backtick_code_block : true,
lineNumConfig = highlightConfig ? highlightConfig.line_number : true,
tabConfig = highlightConfig ? highlightConfig.tab_replace : '',
autoSpacingConfig = config.auto_spacing,
titlecaseConfig = config.titlecase,
newPostConfig = config.new_post_name,
defaultCategory = config.default_category || 'uncategorized',
categoryMap = config.category_map || {},
tagMap = config.tag_map || {},
excerptRegex = /<!--\s*more\s*-->/;

swig.init({tags: tagExt});

if (newPostConfig){
var filenameRE = pathFn.basename(newPostConfig, pathFn.extname(newPostConfig))
.replace(':year', '(\\d{4})')
.replace(/:(month|day)/g, '(\\d{2})')
.replace(':title', '(.*)');

filenameRE = new RegExp(filenameRE);
var filenameArr = newPostConfig.match(/:[a-z]+/g);
}

var getInfoFromFilename = function(str){
var meta = str.match(filenameRE);

if (!meta) return;

var result = {};

_.each(filenameArr, function(item, i){
item = item.substring(1);
result[item] = meta[i + 1];
});

return result;
};


var escape = function(str){
return str
.replace(/\s/g, '-')
.replace(/!/g, '%21')
.replace(/#/g, '%23')
.replace(/\$/g, '%24')
.replace(/&/g, '%26')
.replace(/'/, '%27')
.replace(/\(/g, '%28')
.replace(/\)/g, '%29')
.replace(/\*/g, '%2A')
.replace(/\+/g, '%2B')
.replace(/,/g, '%2C')
.replace(/\//g, '%2F')
.replace(/:/g, '%3A')
.replace(/;/g, '%3B')
.replace(/=/g, '%3D')
.replace(/\?/g, '%3F')
.replace(/@/g, '%40')
.replace(/\[/g, '%5B')
.replace(/\]/g, '%5D');
};

var load = function(source, content, callback){
var extname = pathFn.extname(source).substring(1);

fs.stat(source, function(err, stats){
if (err) throw new Error('Failed to read file status: ' + file.source);

var meta = yfm(content),
mtime = stats.mtime;

//meta.stats = stats;
meta.source = source;

if (meta.date){
meta.date = _.isDate(meta.date) ? meta.date : moment(meta.date, 'YYYY-MM-DD HH:mm:ss').toDate();
}

