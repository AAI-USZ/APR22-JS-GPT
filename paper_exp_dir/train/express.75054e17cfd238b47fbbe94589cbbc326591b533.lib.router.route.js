




module.exports = Route;



function Route(method, path, callbacks, options) {
options = options || {};
this.path = path;
this.method = method;
this.callbacks = callbacks;
this.regexp = normalize(path
, this.keys = []
, options.sensitive
, options.strict);
}

