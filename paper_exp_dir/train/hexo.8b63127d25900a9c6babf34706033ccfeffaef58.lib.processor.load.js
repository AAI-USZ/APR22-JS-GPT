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
categoryMap = config.category_map || {},
tagMap = config.tag_map || {},
excerptRegex = /<!--\s*more\s*-->/;

swig.init({tags: tag});

if (newPostConfig){
var filenameRE = pathFn.basename(newPostConfig, pathFn.extname(newPostConfig))
.replace(':year', '(\\d{4})')
.replace(/:(month|day)/g, '(\\d{2})')
.replace(':title', '(.*)');
