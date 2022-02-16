var fs = require('graceful-fs'),
pathFn = require('path'),
swig = require('swig'),
moment = require('moment'),
_ = require('lodash'),
async = require('async'),
extend = require('../../extend'),
tagExt = extend.tag.list(),
filterExt = extend.filter.list(),
renderFn = require('../../render'),
render = renderFn.render,
isRenderable = renderFn.isRenderable,
route = require('../../route'),
HexoError = require('../../error'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path,
config = hexo.config,
newPostConfig = config.new_post_name,
filenameCaps = config.filename_case,
log = hexo.log,
model = hexo.model,
Post = model('Post'),
Page = model('Page'),
Asset = model('Asset'),
rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g;

swig.init({tags: tagExt});

if (newPostConfig){
var filenameRE = pathFn.basename(newPostConfig, pathFn.extname(newPostConfig))
.replace(/:year/g, '(\\d{4})')
.replace(/:(month|day)/g, '(\\d{2})')
.replace(/:title/g, '(.*)');
