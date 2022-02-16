

var pathRegexp = require('path-to-regexp');
var debug = require('debug')('express:router:layer');



module.exports = Layer;

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
var keys = this.keys;
var params = this.params = {};
var m = this.regexp.exec(path);
var n = 0;
var key;
var val;

if (!m) return false;

this.path = m[0];

for (var i = 1, len = m.length; i < len; ++i) {
key = keys[i - 1];
val = decode_param(m[i]);

if (key) {
params[key.name] = val;
} else {
params[n++] = val;
}
}

return true;
