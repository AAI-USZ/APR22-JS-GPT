var async = require('async'),
pathFn = require('path'),
_ = require('lodash'),
util = require('../util'),
file = util.file2,
yfm = util.yfm;

var View = module.exports = function View(source, path, theme){
this.source = source;
this.path = path;
this.extname = pathFn.extname(path);
this.theme = theme;
this.data = null;
};

View.prototype._getData = function(){
this.data = this.data || yfm(file.readFileSync(this.source));

return this.data;
};

View.prototype.render = function(options, callback){
if (!options.cache) this.invalidate();

