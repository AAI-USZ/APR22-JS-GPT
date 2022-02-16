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


