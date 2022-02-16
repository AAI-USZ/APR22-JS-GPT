




module.exports = Route;



function Route(method, path, fn, options) {
options = options || {};
this.callback = fn;
this.path = path;
this.method = method;
this.middleware = options.middleware;
this.regexp = normalize(path
, this.keys = []
, options.sensitive
, options.strict);
}



Route.prototype.match = function(path){
