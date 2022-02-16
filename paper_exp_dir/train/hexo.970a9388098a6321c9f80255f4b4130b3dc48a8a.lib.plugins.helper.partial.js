var extend = require('../../extend'),
renderSync = require('../../render').renderSync,
util = require('../../util'),
file = util.file,
path = require('path'),
_ = require('lodash'),
cache = {};

var resolve = function(base, part){
return path.resolve(path.dirname(base), path.extname(part) ? part : part + path.extname(base));
};

var render = function(view, options){
var source = resolve(this.filename, view);

if (this.cache && cache.hasOwnProperty(source)){
var content = cache[source];
} else {
var content = file.readSync(source);
if (this.cache) cache[source] = content;
}

