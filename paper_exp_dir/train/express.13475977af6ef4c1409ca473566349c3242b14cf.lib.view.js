

var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var exists = fs.existsSync || path.existsSync;
var join = path.join;



module.exports = View;



function View(name, options) {
options = options || {};
this.name = name;
this.root = options.root;
var engines = options.engines;
this.defaultEngine = options.defaultEngine;
var ext = this.ext = extname(name);
if (!ext && !this.defaultEngine) throw new Error('No default engine was specified and no extension was provided.');
if (!ext) name += (ext = this.ext = ('.' != this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
this.path = this.lookup(name);
}



View.prototype.lookup = function(path){
var ext = this.ext;


if (!utils.isAbsolute(path)) path = join(this.root, path);
if (exists(path)) return path;


path = join(dirname(path), basename(path, ext), 'index' + ext);
if (exists(path)) return path;
};



View.prototype.render = function(options, fn){
this.engine(this.path, options, fn);
};
