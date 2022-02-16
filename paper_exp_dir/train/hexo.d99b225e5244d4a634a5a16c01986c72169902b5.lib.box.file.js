var fs = require('graceful-fs'),
_ = require('lodash'),
util = require('../util'),
file = util.file2;


var File = module.exports = function File(box, source, path, type, params){
this.box = box;
this.source = source;
this.path = path;
this.type = type;
this.params = params;
};


File.prototype.read = function(options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

file.readFile(this.source, options, callback);
};


File.prototype.readSync = function(options){
return file.readFileSync(this.source, options);
};


File.prototype.stat = function(callback){
fs.stat(this.source, callback);
