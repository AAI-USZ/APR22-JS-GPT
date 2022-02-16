var async = require('async'),
extend = require('../extend'),
generator = extend.generator.list(),
processor = extend.processor.list(),
renderer = extend.renderer.list(),
helper = extend.helper.list(),
render = require('../render'),
renderSync = render.renderSync,
route = require('../route'),
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

extend.console.register('generate', 'Generate static files', function(args){
var rendererList = Object.keys(renderer),
start = new Date(),
ignoreTheme = false,
publicExist = false;

if (args.indexOf('-t') !== -1 || args.indexOf('--theme') !== -1) ignoreTheme = true;

async.auto({

load: function(next){
render.compile(themeDir + '_config.yml', next);
},

check: function(next){
fs.exists(publicDir, function(exist){
if (exist) publicExist = exist;
next();
});
},

cache: ['check', function(next){
if (ignoreTheme && publicExist){
var cachePath = baseDir + '.cache';

fs.exists(cachePath, function(exist){
if (exist){
file.read(cachePath, function(err, content){
next(err, JSON.parse(content).theme);
});
} else {
ignoreTheme = false;
next();
}
});
} else {
next();
}
}],

theme_layout: function(next){
var layoutDir = themeDir + 'layout/';

file.dir(layoutDir, function(files){
async.forEach(files, function(item, next){
var extname = path.extname(item),
dirs = item.split(path.sep);

for (var i=0, len=dirs.length; i<len; i++){
var front = dirs[i].substr(0, 1);
if (front === '_' || front === '.') return next();
}

file.read(layoutDir + item, function(err, content){
if (err) throw err;

var name = item.substring(0, item.length - extname.length);
layoutCache[name] = yfm(content);
layoutCache[name].source = layoutDir + item;
next();
});
}, next);
});
},

theme_source: ['check', 'cache', function(next, results){
if (ignoreTheme && publicExist) return next(null, results.cache);

console.log('Installing theme.');

var sourceDir = themeDir + 'source/',
list = [];

file.dir(sourceDir, function(files){
files = _.filter(files, function(item){
var dirs = item.split(path.sep);

for (var i=0, len=dirs.length; i<len; i++){
var front = dirs[i].substr(0, 1);
if (front === '_' || front === '.') return false;
}

return true;
});
