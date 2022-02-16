




var extname = require('path').extname
, dirname = require('path').dirname
, basename = require('path').basename
, utils = require('connect').utils
, clone = require('./utils').clone
, merge = utils.merge
, http = require('http')
, fs = require('fs')
, mime = utils.mime;



var cache = {};



var viewCache = {};



var viewNameCache = {};



var View = exports = module.exports = function View(view, options) {
options = options || {};

this.view = view;
this.root = options.root;
this.defaultEngine = options.defaultEngine;
this.parent = options.parentView;
this.basename = basename(view);
this.engine = this.resolveEngine();
this.extension = '.' + this.engine;
this.path = this.resolvePath();
this.dirname = dirname(this.path);
};



View.prototype.resolveEngine = function(){

if (~this.basename.indexOf('.')) return extname(this.basename).substr(1);

if (this.parent) return this.parent.engine;

return this.defaultEngine;
};



View.prototype.resolvePath = function(){
var path = this.view;

if (!~this.basename.indexOf('.')) path += this.extension;

if ('/' == path[0]) return path;

if (this.parent) return this.parent.dirname + '/' + path;

return this.root
? this.root + '/' + path
: path;
};



View.prototype.__defineGetter__('contents', function(){
return fs.readFileSync(this.path, 'utf8');
});



View.prototype.__defineGetter__('templateEngine', function(){
var ext = this.extension;
return cache[ext]
|| (cache[ext] = require(this.engine));
});



var Partial = exports.Partial = function Partial(view, options) {
options = options || {};
View.call(this, view, options);
this.objectName = options.as || this.resolveObjectName();
this.path = this.dirname + '/_' + basename(this.path);
};



Partial.prototype.__proto__ = View.prototype;



Partial.prototype.resolveObjectName = function(){

return this.view
.split('/')
.slice(-1)[0]
.split('.')[0]
.replace(/[^a-zA-Z0-9 ]+/g, ' ')
.split(/ +/).map(function(word, i){
return i
? word[0].toUpperCase() + word.substr(1)
: word;
}).join('');
};



function cacheViewSync(path) {
return viewCache[path] = fs.readFileSync(path, 'utf8');
}



function objectName(view) {
return view.split('/').slice(-1)[0].split('.')[0];
}



exports.register = function(ext, exports) {
cache[ext] = exports;
};



http.ServerResponse.prototype.partial = function(view, options, locals, parent){


if (parent && !~view.indexOf('.')) {
view += parent.extension;
