var async = require('async'),
extend = require('./extend'),
generator = extend.generator.list(),
processor = extend.processor.list(),
renderer = extend.renderer.list(),
helper = extend.helper.list(),
render = require('./render'),
renderSync = render.renderSync,
route = require('./route'),
Collection = require('./model').Collection,
util = require('./util'),
file = util.file,
yfm = util.yfm,
_ = require('underscore'),
path = require('path'),
sep = path.sep,
fs = require('graceful-fs'),
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
});

var newLocals = _.extend(locals, newHelper);

if (layout.layout){
var content = themeRender(layout.layout, _.extend(locals, {body: layout._content}));
} else {
var content = layout._content;
}

var result = renderSync(content, extname, newLocals);

return result;
};

module.exports = function(ignoreTheme, preview, callback){
var rendererList = Object.keys(renderer),
publicExist = false;

async.auto({

load: function(next){
render.compile(themeDir + '_config.yml', next);
},

check: function(next){
if (preview) return next();

fs.exists(publicDir, function(exist){
if (exist) publicExist = exist;
next();
});
},

cache: ['check', function(next){
