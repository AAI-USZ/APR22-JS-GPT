var fs = require('graceful-fs'),
pathFn = require('path'),
swig = require('swig'),
moment = require('moment'),
_ = require('lodash'),
async = require('async'),
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
filenameCaps = config.filename_case,
excerptRegex = /<!--\s*more\s*-->/;

var existed = {
posts: [],
pages: []
};

swig.init({tags: tagExt});

if (newPostConfig){
var filenameRE = pathFn.basename(newPostConfig, pathFn.extname(newPostConfig))
.replace(/:year/g, '(\\d{4})')
.replace(/:(month|day)/g, '(\\d{2})')
.replace(/:title/g, '(.*)');
