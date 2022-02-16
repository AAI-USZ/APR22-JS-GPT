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
queryEngine = require('query-engine'),
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

this.find = function(query){
queryEngine.createCollection(this.toArray()).findAll(query);
};
};

function Locals(){
this.site = site;
this.page = {};
this.theme = theme.config;

var paginator = this.paginator = new function(){
return {
init: function(base, num, total){
paginator.per_page = config.per_page;
paginator.total = total;
paginator.current = num;
paginator.current_url = base + config.pagination_dir + '/' + num + '/';
paginator.prev = base + config.pagination_dir + '/' + (num - 1);
paginator.next = base + config.pagination_dir + '/' + (num + 1);
paginator.posts = {};

switch (num){
case 1:
paginator.current_url = base;
paginator.prev = '';
break;

case 2:
paginator.prev = base;
break;

case total:
paginator.next = '';
break;
}
}
}
};
};

module.exports = function(){
var start = new Date();

async.series([

function(next){
var publicDir = __dirname + '/../public';

fs.exists(publicDir, function(exist){
if (exist){
