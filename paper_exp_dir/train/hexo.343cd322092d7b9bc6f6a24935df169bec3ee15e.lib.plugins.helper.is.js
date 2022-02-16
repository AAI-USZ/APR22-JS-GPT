'use strict';

var util = require('hexo-util');
var escapeRegExp = util.escapeRegExp;

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
var path = this.path;


if (!path || path === 'index.html') return true;

var paginationDir = this.config.pagination_dir;
var r = regexCache.home[paginationDir];

if (!r){
r = regexCache.home[paginationDir] = new RegExp('^' + escapeRegExp(paginationDir) + '\\/\\d+\\/(index\.html)?$');
}
