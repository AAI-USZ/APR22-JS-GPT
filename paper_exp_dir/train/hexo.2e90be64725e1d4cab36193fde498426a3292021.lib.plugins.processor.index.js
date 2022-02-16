var fs = require('graceful-fs'),
pathFn = require('path'),
swig = require('swig'),
moment = require('moment'),
_ = require('lodash'),
async = require('async'),
extend = require('../../extend'),
tagExt = extend.tag.list(),
renderFn = require('../../render'),
render = renderFn.render,
isRenderable = renderFn.isRenderable,
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
highlightConfig = config.highlight,
highlightEnable = highlightConfig.enable,
backtickConfig = highlightConfig.backtick_code_block,
lineNumConfig = highlightConfig.line_number,
tabConfig = highlightConfig.tab_replace,
autoSpacingConfig = config.auto_spacing,
titlecaseConfig = config.titlecase,
newPostConfig = config.new_post_name,
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

filenameRE = new RegExp(filenameRE);
var filenameArr = _.map(newPostConfig.match(/:[a-z]+/g), function(item){
return item.substring(1);
});
}

var getInfoFromFilename = function(str){
if (!filenameRE.test(str)) return;

var meta = str.match(filenameRE).slice(1),
result = {};

for (var i=0, len=filenameArr.length; i<len; i++){
result[filenameArr[i]] = meta[i];
}

return result;
};



var escape = function(str){
var str = str.toString()
.replace(/\s/g, '-')
.replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=|\\|%|<|>|\./g, '');

if (filenameCaps == 1){
str = str.toLowerCase();
} else if (filenameCaps == 2){
str = str.toUpperCase();
