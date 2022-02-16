var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
route = require('../route'),
Collection = require('../model').Collection,
util = require('../util'),
file = util.file,
yfm = util.yfm,
titlecase = util.titlecase,
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
excerptRegex = /<!--\s*more\s*-->/;

swig.init({tags: tag});

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
