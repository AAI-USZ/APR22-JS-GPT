




module.exports = Route;



function Route(method, path, fn, options) {
options = options || {};
this.callback = fn;
this.path = path;
this.regexp = normalize(path, this.keys = [], options.sensitive);
this.method = method;
}



function normalize(path, keys, sensitive) {
if (path instanceof RegExp) return path;
