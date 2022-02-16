




var path = require('path')
, fs = require('fs')
, dirname = path.dirname
, basename = path.basename
, extname = path.extname
, exists = path.existsSync
, join = path.join;



module.exports = View;



function View(name, options) {
options = options || {};
this.name = name;
this.root = options.root;
var engines = options.engines;
this.defaultEngine = options.defaultEngine;
this.ext = extname(name);
if (!this.ext) name += '.' + (this.ext = this.defaultEngine);
this.engine = engines[this.ext] || (engines[this.ext] = require(this.ext));
this.path = this.lookup(name);
this.string = fs.readFileSync(this.path, 'utf8');
}



View.prototype.lookup = function(path){

path = join(this.root, path);
if (exists(path)) return path;


path = join(dirname(path), basename(path, '.' + this.ext), 'index.' + this.ext);
if (exists(path)) return path;
};
