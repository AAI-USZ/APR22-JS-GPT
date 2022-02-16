var _ = require('underscore'),
async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
sep = pathFn.sep,
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
layoutDir = themeDir + 'layout' + sep,
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
async.auto({
theme_config: function(next){
var path = themeDir + '_config.yml';

fs.exists(path, function(exist){
if (!exist) return next();
next(null, require(path));
});
},
theme_layout: function(next){
file.dir(layoutDir, function(files){
async.forEach(files, function(item, next){
var extname = pathFn.extname(item),
split = item.split(sep);

for (var i=0, len=split.length; i<len; i++){
var front = split[i].substring(0, 1);
if (front === '_' || front === '.') return next();
}

file.read(layoutDir + item, function(err, content){
if (err) throw new Error('Failed to read layout: ' + layoutDir + item);

var name = item.substring(0, item.length - extname.length),
layout = layoutCache[name] = yfm(content);
layout.source = layoutDir + item;
next();
});
}, next);
});
},
theme_source: function(next){
var sourceDir = themeDir + 'source' + sep,
list = Object.keys(renderer);

file.dir(sourceDir, function(files){
files = _.filter(files, function(item){
var split = item.split(sep),
match = true;

for (var i=0, len=split.length; i<len; i++){
var front = split[i].substring(0, 1);
if (front === '_' || front === '.'){
match = false;
break;
}
}

return match;
});

async.forEach(files, function(item, next){
var source = sourceDir + item,
extname = pathFn.extname(item).substring(1);


fs.stat(source, function(err, stats){
if (err) throw new Error('Failed to read file status: ' + source);


var data = dbAssets.findOne({path: source}),
mtime = stats.mtime;


if (data){

if (data.mtime.getTime() === mtime.getTime()) return next();


dbAssets.update(data._id, {mtime: mtime});
} else {

dbAssets.insert({path: source, mtime: mtime});
}


if (list.indexOf(extname) === -1){
route.set(item, function(fn){
fn(null, fs.createReadStream(source));
});

next();
} else {
var filename = item.substring(0, item.length - extname.length - 1),
fileext = pathFn.extname(filename),
dest = filename + '.' + (fileext ? fileext.substring(1) : renderer[extname].output);

route.set(dest, function(fn){
compile(source, function(err, result){
if (err) throw new Error('Failed to compile file: ' + source);
fn(null, result);
});
});

next();
}
});
}, next);
});
},
theme_i18n: function(next){
var langDir = themeDir + 'languages';

fs.exists(langDir, function(exist){
if (!exist) return next();

var theme_i18n = new i18n();
theme_i18n.load(langDir, function(){
next(null, theme_i18n);
});
});
},
process: function(next){
file.dir(sourceDir, function(files){
files = _.filter(files, function(item){
var split = item.split(sep),
match = true;

for (var i=0, len=split.length; i<len; i++){
if (split[i].substring(0, 1) === '.'){
match = false;
break;
}
}

return match;
});

process(files, next);
});
},
