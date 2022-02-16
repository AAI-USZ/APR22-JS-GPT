
var pathRegexp = require('path-to-regexp');
var debug = require('debug')('express:router:layer');

function Layer(path, options, fn) {
if (!(this instanceof Layer)) {
return new Layer(path, options, fn);
}

debug('new %s', path);
options = options || {};
this.regexp = pathRegexp(path, this.keys = [], options);
this.handle = fn;
}



Layer.prototype.match = function(path){
var keys = this.keys
, params = this.params = {}
, m = this.regexp.exec(path)
, n = 0;
