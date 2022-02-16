var extend = require('../extend'),
renderSync = require('../render').renderSync,
util = require('../util'),
file = util.file,
path = require('path'),
_ = require('underscore'),
cache = {};

var resolve = function(base, part){
return path.resolve(path.dirname(base), path.extname(part) ? part : part + path.extname(base));
};

