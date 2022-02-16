var async = require('async'),
extend = require('../extend'),
generator = extend.generator.list(),
processor = extend.processor.list(),
helper = extend.helper.list(),
renderer = Object.keys(extend.renderer.list()),
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
themeDir = hexo.theme_dir,
publicDir = hexo.public_dir,
themeConfig = {},
layoutCache = {};

var site = {
posts: new Collection(),
pages: new Collection()
};

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
var start = new Date(),
ignoreTheme = false,
ignoreList = [],
publicExist = false;

if (_.indexOf(args, '-t') !== -1 || _.indexOf(args, '--theme') !== -1) ignoreTheme = true;

async.series([

function(next){
render.compile(themeDir + '_config.yml', function(err, file){
if (err) throw err;

if (file){
_.each(file, function(val, key){
