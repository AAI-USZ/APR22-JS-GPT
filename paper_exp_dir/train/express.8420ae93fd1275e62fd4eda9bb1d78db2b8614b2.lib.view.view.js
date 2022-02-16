




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, fs = require('fs')
, stat = fs.statSync;



var cache = {};



var View = exports = module.exports = function View(view, options) {
options = options || {};
this.view = view;
this.root = options.root;
this.relative = false !== options.relative;
this.defaultEngine = options.defaultEngine;
this.parent = options.parentView;
this.basename = basename(view);
this.engine = this.resolveEngine();
this.extension = '.' + this.engine;
this.name = this.basename.replace(this.extension, '');
this.path = this.resolvePath();
this.dirname = dirname(this.path);
};



View.prototype.__defineGetter__('exists', function(){
try {
stat(this.path);
return true;
} catch (err) {
return false;
}
});



View.prototype.resolveEngine = function(){

if (~this.basename.indexOf('.')) return extname(this.basename).substr(1);

if (this.parent) return this.parent.engine;

return this.defaultEngine;
};



View.prototype.resolvePath = function(){
var path = this.view;

if (!~this.basename.indexOf('.')) path += this.extension;

if ('/' == path[0]) return path;

if (this.relative && this.parent) return this.parent.dirname + '/' + path;

return this.root
? this.root + '/' + path
: path;
};



View.prototype.__defineGetter__('contents', function(){
return fs.readFileSync(this.path, 'utf8');
});



View.prototype.__defineGetter__('templateEngine', function(){
var ext = this.extension;
return cache[ext] || (cache[ext] = require(this.engine));
});



View.prototype.__defineGetter__('rootPath', function(){
this.relative = false;
return this.resolvePath();
});



View.prototype.__defineGetter__('indexPath', function(){
return this.dirname
+ '/' + this.basename.replace(this.extension, '')
+ '/index' + this.extension;
});



View.prototype.__defineGetter__('upIndexPath', function(){
return this.dirname + '/../' + this.name + '/index' + this.extension;
});



View.prototype.__defineGetter__('prefixPath', function(){
return this.dirname + '/_' + this.basename;
});



exports.register = function(ext, exports) {
if ('.' != ext[0]) ext = '.' + ext;
cache[ext] = exports;
};
