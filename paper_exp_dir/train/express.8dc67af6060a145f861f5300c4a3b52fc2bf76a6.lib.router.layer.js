

var pathRegexp = require('path-to-regexp');
var debug = require('debug')('express:router:layer');



module.exports = Layer;

function Layer(path, options, fn) {
if (!(this instanceof Layer)) {
return new Layer(path, options, fn);
}

debug('new %s', path);
options = options || {};

this.handle = fn;
this.params = undefined;
this.path = undefined;
this.regexp = pathRegexp(path, this.keys = [], options);

if (path === '/' && options.end === false) {
this.regexp.fast_slash = true;
}
}


