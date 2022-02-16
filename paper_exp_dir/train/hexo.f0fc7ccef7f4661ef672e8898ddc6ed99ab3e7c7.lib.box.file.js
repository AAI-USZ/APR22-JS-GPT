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

options = _.extend({
cache: false
}, options);

if (options.cache){
hexo.model('Cache').loadCache(this.source.substring(hexo.base_dir.length), callback);
} else {
file.readFile(this.source, callback);
}
};


File.prototype.readSync = function(options){
options = _.extend({
cache: false
}, options);

if (options.cache){
return hexo.model('Cache').loadCacheSync(this.source.substring(hexo.base_dir.length));
} else {
return file.readFileSync(this.source);
}
};
