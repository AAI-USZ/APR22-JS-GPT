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
Asset = model('Asset');

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

var load = function(file, callback){
var source = file.source,
path = file.path;

async.parallel([
function(next){
file.read({cache: true}, next);
},
function(next){
file.stat(next);
}
], function(err, results){
if (err) return callback(HexoError('Source file read failed: ' + source));

var content = results[0],
stat = results[1],
meta = yfm(content);

meta.source = path;
meta.original_content = content;
meta.mtime = stat.mtime;
meta.ctime = stat.ctime;
if (meta.date && !_.isDate(meta.date)) meta.date = moment(meta.date, 'YYYY-MM-DD HH:mm:ss').toDate();
if (meta.updated){
if (!_.isDate(meta.updated)) meta.updated = moment(meta.updated, 'YYYY-MM-DD HH:mm:ss').toDate();
} else {
meta.updated = stat.mtime;
}

async.waterfall([
function(next){
if (meta._content){
next(null, swig.compile(meta._content)());
} else {
delete meta._content;
meta.content = '';
meta.excerpt = 0;
callback(null, meta);
}
},
function(compiled, next){
delete meta._content;

var cache = [],
length = 0;

meta.content = compiled;


meta.content = meta.content.replace(/<notextile>([\s\S]+?)<\/notextile>/g, function(match, str){
cache.push(str);
return '<notextile>' + length++ + '</notextile>\n';
});

filterExt.pre.forEach(function(filter){
var result = filter(meta);

if (result){
result.content = result.content.replace(/<escape>([\s\S]+?)<\/escape>/g, function(match, str){
cache.push(str);
return '<notextile>' + length++ + '</notextile>\n';
});

meta = result;
}
});


render({text: meta.content, path: source}, function(err, result){
if (err) return callback(HexoError(err, 'Source file render failed: ' + source));


meta.content = result.replace(/<notextile>(.*?)<\/notextile>/g, function(match, str){
return cache[str];
});

filterExt.post.forEach(function(filter){
var result = filter(meta);

if (result) meta = result;
});

callback(null, meta);
});
}
]);
});
};

extend.processor.register(/^_posts\/([^_](?:(?!\/_).)*)$/, function(file, callback){
var source = file.source,
path = file.path,
match = file.params[1].match(/((.+)\/)?(.+)\.(.+[^%~])$/);

if (!match) return callback();

var data = Post.findOne({source: path});


if (file.type === 'delete' && data){
route.remove(data.path);
Post.del(data._id);

return callback();
}

var category = match[2],
filename = match[3],
extname = match[4];


if (!isRenderable(extname)) return callback();

load(file, function(err, meta){
if (err) return callback(HexoError(err, 'Source file load failed: ' + source));

if (filenameRE){
var info = getInfoFromFilename(filename);
if (info){
filename = info.title;
}

if (!meta.date){
if (info && info.year && info.month && info.day){
meta.date = new Date(info.year, info.month - 1, info.day);
} else {
meta.date = stat.ctime;
}
}
}

if (meta.categories){
if (!Array.isArray(meta.categories)) meta.categories = meta.categories.split('/');
if (category) meta.categories = category.split('/').concat(meta.categories);
} else if (category){
meta.categories = category.split('/');
}

if (meta.permalink){
var link = meta.slug = escape(meta.permalink);
if (!pathFn.extname(link) && link.substr(link.length - 1, 1) !== '/') link += '/';
delete meta.permalink;
} else {
meta.slug = escape(filename);
}

if (data) meta._id = data._id;

Post.save(meta);
log.d('Source file processed: ' + source);
callback();
});
});

extend.processor.register(/^[^_](?:(?!\/_).)*$/, function(file, callback){
var source = file.source,
path = file.path,
extname = pathFn.extname(path).substring(1);

if (isRenderable(extname)){
var data = Page.findOne({source: path});


if (file.type === 'delete' && data){
route.remove(data.path);
Page.remove(data._id);

return callback();
}

load(file, function(err, meta){
if (err) return callback(HexoError(err, 'Source file load failed: ' + source));

if (!meta.date) meta.date = meta.ctime;

if (meta.permalink){
var link = meta.permalink;

if (!pathFn.extname(link)){
if (link.substr(link.length - 1, 1) === '/') link += 'index.html';
else link += '/index.html';
}
} else {
var link = path.substring(0, path.length - extname.length) + 'html';
}

meta.path = link;

if (data){
Page.update(data._id, meta);
} else {
Page.insert(meta);
}

log.d('Source file processed: ' + source);
callback();
});
} else {
var data = Asset.findOne({source: 'source/' + path});

if (file.type === 'delete' && data){
route.remove(path);
Asset.remove(data._id);

return callback();
}

Asset.checkModified(source, function(err, modified){
if (err) return callback(HexoError(err, 'Source file load failed: ' + source));

var content = function(fn){
fn(null, fs.createReadStream(source));
};

content.modified = modified;

route.set(path, content);
log.d('Source file processed: ' + source);
callback();
});
}
});
