




var utils = require('../utils');



module.exports = Route;



function Route(method, path, callbacks, options) {
options = options || {};
this.path = path;
this.method = method;
this.callbacks = callbacks;
this.regexp = utils.pathRegexp(path
, this.keys = []
, options.sensitive
, options.strict);
}



Route.prototype.match = function(path){
var keys = this.keys
, params = this.params = []
, m = this.regexp.exec(path);

if (!m) return false;

for (var i = 1, len = m.length; i < len; ++i) {
var key = keys[i - 1];

var val = 'string' == typeof m[i]
? decodeURIComponent(m[i])
: m[i];

if (key) {
params[key.name] = val;
} else {
params.push(val);
}
}

return true;
};
