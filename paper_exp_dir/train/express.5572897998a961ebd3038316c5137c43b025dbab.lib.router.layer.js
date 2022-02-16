var utils = require('../utils')
, debug = require('debug')('express:router:layer')

function Layer(path, options, fn) {
if (!(this instanceof Layer)) {
return new Layer(path, options, fn);
}

debug('new %s', path);
options = options || {};
this.path = path;
this.params = {};
this.regexp = utils.pathRegexp(path
, this.keys = []
, options.sensitive
, options.strict
, options.end);
this.handle = fn;
}



Layer.prototype.match = function(path){
var keys = this.keys
, params = this.params = {}
, m = this.regexp.exec(path)
, n = 0;
var key;
var val;

if (!m) return false;

for (var i = 1, len = m.length; i < len; ++i) {
key = keys[i - 1];

try {
val = 'string' == typeof m[i]
? decodeURIComponent(m[i])
