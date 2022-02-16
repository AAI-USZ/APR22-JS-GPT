var util = require('./util'),
file = util.file,
yfm = util.yfm,
process = require('./process'),
renderFn = require('./render'),
render = renderFn.render,
renderFile = renderFn.renderFile,
isRenderable = renderFn.isRenderable,
getOutput = renderFn.getOutput,
model = require('./model'),
dbAssets = model.assets,
extend = require('./extend'),
generator = extend.generator.list(),
route = require('./route'),
i18n = require('./i18n').i18n,
_ = require('lodash'),
async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
watchr = require('watchr'),
config = hexo.config,
baseDir = hexo.base_dir,
sourceDir = hexo.source_dir,
themeDir = hexo.theme_dir,
urlConfig = config.url,
rootConfig = config.root,
layoutDir = themeDir + 'layout/';

var hiddenFileRegex = /^[^\.](?:(?!\/\.).)*$/,
hiddenAdvFileRegex = /^[^_\.](?:(?!\/[_\.]).)*$/;

module.exports = function(options, callback){
var watch = options.watch,
themeConfig = {},
themeLayout = {},
themei18n = new i18n();

var afterProcess = function(callback){
async.parallel([
function(next){
hexo.db.save(next);
},
function(next){
async.forEach(generator, function(item, next){
item(model, function(path, layout, locals){
if (!Array.isArray(layout)) layout = [layout];

var newLocals = {
page: locals,
site: model,
config: config,
theme: themeConfig,
__: themei18n.get,
path: path,
url: urlConfig + rootConfig + path,
layout: 'layout',
cache: !watch
};

for (var i=0, len=layout.length; i<len; i++){
var item = layout[i];
if (themeLayout.hasOwnProperty(item)){
var layoutPath = layoutDir + item + themeLayout[item];
break;
}
}

route.set(path, function(fn){
renderFile(layoutPath, newLocals, fn);
});
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
fs.exists(layoutDir, function(exist){
if (!exist) throw new Error('Layout not found.');
file.dir(layoutDir, function(files){
for (var i=0, len=files.length; i<len; i++){
var item = files[i];
if (hiddenAdvFileRegex.test(item)){
var extname = pathFn.extname(item),
name = item.substring(0, item.length - extname.length);
themeLayout[name] = extname;
}
}
next();
});
});
},

function(next){
var sourceDir = themeDir + 'source/';

fs.exists(sourceDir, function(exist){
if (!exist) return next();

file.dir(sourceDir, function(files){
files = _.filter(files, function(item){
return hiddenAdvFileRegex.test(item);
});

async.forEach(files, function(item, next){
var source = sourceDir + item,
extname = pathFn.extname(item).substring(1);

fs.stat(source, function(err, stats){
if (err) throw new Error('File status read error: ' + source);

var data = dbAssets.findOne({source: source.substring(baseDir.length)}),
mtime = stats.mtime,
latest = false;

if (data){
if (data.mtime.getTime() === mtime.getTime()){
latest = true;
} else {
dbAssets.update(data._id, {mtime: mtime});
}
} else {
dbAssets.insert({source: source.substring(baseDir.length), mtime: mtime});
}

if (isRenderable(extname)){
var filename = item.substring(0, item.length - extname.length - 1),
fileext = pathFn.extname(filename),
dest = filename + '.' + (fileext ? fileext.substring(1) : getOutput(extname));

var content = function(fn){
render({path: source}, function(err, result){
if (err) throw new Error('Compile error: ' + source);
fn(null, result);
});
};
content.latest = latest;
route.set(dest, content);
} else {
var content = function(fn){
fn(null, fs.createReadStream(source));
};
content.latest = latest;
route.set(item, content);
}

next();
});
}, next);
});
});
},

function(next){
var langDir = themeDir + 'languages';

fs.exists(langDir, function(exist){
if (!exist) return next();
themei18n.load(langDir, next);
});
},

function(next){
file.dir(sourceDir, function(files){
files = _.filter(files, function(item){
return hiddenFileRegex.test(item);
});

process(files, next);
});
}
], function(){
afterProcess(function(){
callback();

if (watch){
var arr = [],
timer;

var timerFn = function(){
if (arr.length){
process(arr, afterProcess);
arr = [];
}
};

watchr.watch({
path: sourceDir,
ignoreHiddenFiles: true,
listener: function(type, source){

clearTimeout(timer);

for (var i=0, len=arr.length; i<len; i++){
if (arr[i].path === path){
arr.splice(i, 1);
i--;
len--;
}
}

arr.push({type: type, path: path});
timer = setTimeout(timerFn, 100);
}
});
}
});
});
};
