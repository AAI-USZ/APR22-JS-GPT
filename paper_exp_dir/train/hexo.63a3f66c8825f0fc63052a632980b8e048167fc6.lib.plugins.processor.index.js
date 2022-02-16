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
excerptRegex = /<!--\s*more\s*-->/;

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


var escapeRule = {
'\s': '-',
'!': '%21',
'#': '%23',
'$': '%24',
'&': '%26',
"'": '%27',
'(': '%28',
')': '%29',
'*': '%2A',
'+': '%2B',
',': '%2C',
'/': '%2F',
':': '%3A',
';': '%3B',
'=': '%3D',
'?': '%3F',
'@': '%40',
'[': '%5B',
']': '%5D'
};

var escape = function(str){
return str.replace(/\s|!|#|\$|&|'|\(|\)|\*|\+|,|\/|:|;|\*|\?|@|\[|\]/g, function(match){
return escapeRule[match];
});
};

var load = function(file, stat, callback){
var source = file.source,
extname = file.params[3];

file.read(function(err, content){
if (err) throw new Error('File read error: ' + source);

var meta = yfm(content);

meta.source = source;
meta.mtime = stat.mtime;
meta.ctime = stat.ctime;
if (!_.isDate(meta.date)) meta.date = moment(meta.date, 'YYYY-MM-DD HH:mm:ss').toDate();
if (meta.updated){
if (!_.isDate(meta.updated)) meta.updated = moment(meta.updated, 'YYYY-MM-DD HH:mm:ss').toDate();
} else {
meta.updated = stat.mtime;
}

