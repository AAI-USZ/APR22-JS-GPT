var util = require('./util'),
file = util.file,
yfm = util.yfm,
process = require('./process'),
renderFn = require('./render'),
render = renderFn.render,
renderSync = renderFn.renderSync,
model = require('./model'),
dbAssets = model.assets,
extend = require('./extend'),
renderer = extend.renderer.list(),
generator = extend.generator.list(),
helper = extend.helper.list(),
route = require('./route'),
i18n = require('./i18n').i18n,
_ = require('lodash'),
async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
watchr = require('watchr'),
config = hexo.config;

var hiddenFileRegex = /^[^\.](?:(?!\/\.).)*$/,
hiddenAdvFileRegex = /^[^_\.](?:(?!\/[_\.]).)*$/;

module.exports = function(options, callback){
var sourceDir = hexo.source_dir,
themeDir = hexo.theme_dir,
watch = hexo.cache.watch = options.watch,
themeConfig = {},
themeLayout = {},
themei18n = new i18n();

var themeRender = function(template, locals){
if (!themeLayout[template]) return '';

var layout = themeLayout[template],
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

var result = renderSync({text: content, path: source}, newLocals);

return result;
};

var afterProcess = function(callback){
async.parallel([
function(next){
hexo.db.save(next);
},
function(next){
async.forEach(generator, function(item, next){
item(model, function(layout, locals, callback){
var newLocals = {
page: locals,
site: model,
config: config,
theme: themeConfig,
__: themei18n.get
};

return themeRender(layout, newLocals);
}, next);
}, next);
}
], callback);
};

async.parallel([

function(next){
var path = themeDir + '_config.yml';
fs.exists(path, function(exist){
if (!exist) return next();
render({path: path}, function(err, result){
if (err) return new Error('Theme config load error: ' + source);
themeConfig = result;
Object.freeze(themeConfig);
next();
});
});
},


function(next){
var layoutDir = themeDir + 'layout/';
file.dir(layoutDir, function(files){
