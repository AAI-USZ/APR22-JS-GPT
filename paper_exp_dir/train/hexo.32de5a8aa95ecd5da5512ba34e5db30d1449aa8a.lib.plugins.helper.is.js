var util = require('hexo-util');
var escape = util.escape;

var regexCache = {
home: {},
post: {}
};

function isCurrentHelper(path, strict){
if (strict){
if (path[path.length - 1] === '/') path += 'index.html';

return this.path === path;
} else {
path = path.replace(/\/index\.html$/, '/');

return this.path.substring(0, path.length) === path;
}
}

function isHomeHelper(){
if (this.path === '') return true;

var paginationDir = this.config.pagination_dir;
var r = regexCache.home[paginationDir];

if (!r){
r = regexCache.home[paginationDir] = new RegExp('^' + escape.regex(paginationDir) + '\\/\\d+\\/');
}

return r.test(this.path);
}

function isPostHelper(){
var permalink = this.config.permalink;
var r = regexCache.post[permalink];

if (!r){
var rUrl = escape.regex(permalink)
.replace(':id', '\\d+')
.replace(':category', '(\\w+\\/?)+')
.replace(':year', '\\d{4}')
.replace(/:(month|day)/g, '\\d{2}')
.replace(/:i_(month|day)/g, '\\d{1,2}')
.replace(/:title/, '[^\\/]+');

r = regexCache.post[permalink] = new RegExp(rUrl);
}

return r.test(this.path);
}

function isArchiveHelper(){
return Boolean(this.archive);
}

function isYearHelper(year){
if (!this.archive) return false;

if (year){
return this.year === year;
} else {
return Boolean(this.year);
}
}
