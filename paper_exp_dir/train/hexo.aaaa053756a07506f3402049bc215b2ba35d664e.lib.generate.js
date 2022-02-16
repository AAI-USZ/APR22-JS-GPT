var config = require('./config'),
log = require('./log'),
render = require('./render'),
file = require('./file'),
theme = require('./theme'),
async = require('async'),
clc = require('cli-color'),
fs = require('graceful-fs'),
ejs = require('ejs'),
path = require('path'),
rimraf = require('rimraf'),
_ = require('underscore');

var site = config;
site.time = new Date();
site.posts = new Posts();
site.pages = new Posts();
site.categories = {};
site.tags = {};

function Posts(){
var init = function(arr){
var newObj = new Posts();

if (arr){
for (var i=0, len=arr.length; i<len; i++){
newObj[i] = arr[i];
}

newObj.length = len;
}

return newObj;
};

this.length = 0;

this.each = function(callback){
for (var i=0, len=this.length; i<len; i++){
var _callback = callback(this[i], i);

if (typeof _callback !== 'undefined'){
if (_callback){
continue;
} else {
break;
}
}
}
};

this.toArray = function(){
var result = [];

this.each(function(item){
result.push(item);
});

return result;
};

this.slice = function(start, end){
return init([].slice.apply(this.toArray(), arguments));
};

this.skip = function(num){
return init(this.slice(num));
};

this.limit = function(num){
return init(this.slice(0, num));
};

this.push = function(item){
this[this.length] = item;
this.length++;
};

this.sort = function(field, order){
var arr = this.toArray().sort(function(a, b){
return a[field] - b[field];
});

if (typeof order !== 'undefined' && (order === -1 || order.toLowerCase() === 'desc')){
arr = arr.reverse();
};

return init(arr);
};

this.random = function(){
var arr = this.toArray().sort(function(a, b){
return Math.random() - 0.5 < 0;
});

return init(arr);
};


};

var paginator = function(base, num, total){
var result = {
per_page: config.per_page,
total: total,
current: num,
current_url: base + config.pagination_dir + '/' + num + '/',
prev: '',
next: ''
};

result.prev = base + config.pagination_dir + '/' + (num - 1);
result.next = base + config.pagination_dir + '/' + (num + 1);

switch (num){
case 1:
result.current_url = base;
result.prev = '';
break;

case 2:
result.prev = base;
break;

case total:
result.next = '';
break;
}

return result;
};

var readDir = function(source, callback, parent){
fs.readdir(source, function(err, files){
if (err) throw err;

var result = [];

async.forEach(files, function(item, next){
var extname = path.extname(item);

if (extname === ''){
fs.stat(source + '/' + item, function(err, stats){
if (err) throw err;

if (stats.isDirectory()){
readDir(source + '/' + item, function(children){
result = result.concat(children);
next(null);
}, (parent ? parent + '/' : '') + item);
} else {
result.push((parent ? parent + '/' : '') + item);
next(null);
}
});
} else {
result.push((parent ? parent + '/' : '') + item);
next(null);
}
}, function(){
callback(result);
});
})
};

var getLayout = function(layout, callback){
fs.readFile(__dirname + '/../themes/' + config.theme + '/' + layout, 'utf8', function(err, file){
if (err) throw err;
callback(file);
});
};

module.exports = function(){
var start = new Date();

async.series([

function(next){
var publicDir = __dirname + '/../public';

fs.exists(publicDir, function(exist){
if (exist){
rimraf(publicDir, function(err){
if (err) throw err;
log.info('Previous generated file deleted.');
next(null);
});
} else {
next(null);
}
});
},

function(next){
var source = __dirname + '/../source';

readDir(source, function(files){
async.forEach(files, function(item, next){
var extname = path.extname(item),
filename = path.basename(item, extname),
dirs = path.dirname(item).split(path.sep);

switch (extname){
case '.txt':
case '.text':
case '.md':
case '.markdown':
case '.mdown':
case '.markdn':
case '.mkd':
case '.mkdn':
case '.mdwn':
case '.mdtxt':
case '.mdtext':
case '.mdml':
case '.html':
if (dirs[0] === '_stash'){
next(null);
} else if (dirs[0] === '_posts'){
var category = dirs.slice(1).join(path.sep);
render.read(source + '/' + item, 'post', category, function(locals){
site.posts.push(locals);
next(null);
});
} else {
render.read(source + '/' + item, 'page', item, function(locals){
site.pages.push(locals);
next(null);
});
}

break;

default:
if (item.substring(0, 1) === '_'){
next(null);
} else {
file.copy(source + '/' + item, __dirname + '/../public/' + item);
next(null);
}

break;
}
}, function(){
log.info('Source file loaded.');
next(null);
});
});
},

function(next){
site.posts = site.posts.sort('date', -1);

site.posts.each(function(item){
if (item.hasOwnProperty('categories')){
item.categories.forEach(function(cat){
if (site.categories.hasOwnProperty(cat.name)){
site.categories[cat.name].push(item);
} else {
var newCat = new Posts();
newCat.permalink = cat.permalink;
newCat.push(item);
site.categories[cat.name] = newCat;
}
});
}

if (item.hasOwnProperty('tags')){
item.tags.forEach(function(tag){
if (site.tags.hasOwnProperty(tag.name)){
site.tags[tag.name].push(item);
} else {
var newTag = new Posts();
newTag.permalink = tag.permalink;
newTag.push(item);
site.tags[tag.name] = newTag;
}
});
}
});

log.info('Source file analyzed.');
next(null);
}
], function(){
async.parallel([

function(next){
require('./theme').asset(next);
},

function(next){
async.forEach(site.posts.toArray(), function(item, next){
var locals = {
site: site,
page: item,
theme: theme.config
};

render.render(locals, function(result){
file.write(__dirname + '/../public' + item.permalink + '/index.html', result, function(err){
if (err) throw err;
log.debug('%s generated.', clc.bold(item.permalink));
next(null);
});
});
}, function(){
log.info('%d %s generated.', site.posts.length, site.posts.length > 1 ? 'posts' : 'post');
next(null);
});
},

function(next){
async.forEach(site.pages.toArray(), function(item, next){
var locals = {
site: site,
page: item,
theme: theme.config
};

render.render(locals, function(result){
file.write(__dirname + '/../public' + item.permalink, result, function(err){
if (err) throw err;
