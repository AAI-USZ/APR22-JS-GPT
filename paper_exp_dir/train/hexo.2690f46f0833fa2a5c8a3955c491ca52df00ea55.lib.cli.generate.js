var async = require('async'),
extend = require('../extend'),
generator = extend.generator.list(),
processor = extend.processor.list(),
helper = extend.helper.list(),
render = require('../render'),
renderSync = render.renderSync,
Collection = require('../model').Collection,
util = require('../util'),
file = util.file,
yfm = util.yfm,
_ = require('underscore'),
path = require('path'),
fs = require('fs'),
config = hexo.config,
baseDir = hexo.base_dir,
themeDir = hexo.theme_dir,
publicDir = hexo.public_dir,
i18n = hexo.i18n,
layoutCache = {};

var themeRender = function(template, locals){
if (!layoutCache[template]) return '';

var layout = layoutCache[template],
source = layout.source,
extname = path.extname(source).substring(1),
newHelper = _.clone(helper);

_.each(newHelper, function(val, key){
newHelper[key] = val(source, layout.content, locals);
