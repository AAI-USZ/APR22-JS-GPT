




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
var ext = this.ext = extname(name);
if (!ext) name += (ext = this.ext = '.' + this.defaultEngine);
this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).render);
this.path = this.lookup(name);
this.string = this.contents();
}



View.prototype.contents = function(){
return fs.readFileSync(this.path, 'utf8');
};

