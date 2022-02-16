




var path = require('path')
, fs = require('fs')
, extname = path.extname
, join = path.join;



module.exports = View;



function View(name, options) {
options = options || {};
this.name = name;
var engines = options.engines;
this.defaultEngine = options.defaultEngine;
this.extname = extname(name);
if (!this.extname) name += '.' + (this.extname = this.defaultEngine);
this.engine = engines[this.extname] || (engines[this.extname] = require(this.extname));
this.path = join(options.root, name);
this.string = fs.readFileSync(this.path, 'utf8');
}



View.prototype.render = function(options, fn){
options.filename = this.path;
