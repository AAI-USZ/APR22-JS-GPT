var _ = require('underscore'),
async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
watchr = require('watchr'),
process = require('./process'),
model = require('./model'),
dbAssets = model.assets,
route = require('./route'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
i18n = require('./i18n').i18n,
render = require('./render'),
compile = render.compile,
extend = require('./extend'),
renderer = extend.renderer.list(),
helper = extend.helper.list(),
generator = extend.generator.list(),
config = hexo.config,
baseDir = hexo.base_dir,
sourceDir = hexo.source_dir,
themeDir = hexo.theme_dir,
layoutDir = themeDir + 'layout/',
layoutCache = {};

var freeze = function(obj){
var result = {};

_.each(obj, function(val, key){
result.__defineGetter__(key, function(){
return val;
});
});

Object.freeze(result);

return result;
};

var themeRender = function(template, locals){
if (!layoutCache[template]) return '';

var layout = layoutCache[template],
source = layout.source,
extname = pathFn.extname(source).substring(1),
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

var result = render.renderSync(content, extname, newLocals);

return result;
};

module.exports = function(options, callback){
var watch = hexo.cache.watch = options.watch;

async.parallel([

function(next){
var path = themeDir + '_config.yml';
fs.exists(path, function(exist){
next(null, exist ? require(path) : null);
});
},

