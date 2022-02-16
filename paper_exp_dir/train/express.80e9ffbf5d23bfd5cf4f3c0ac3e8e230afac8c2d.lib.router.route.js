




module.exports = Route;



function Route(method, path, fn, options) {
options = options || {};
this.callback = fn;
this.path = path;
this.method = method;
this.regexp = normalize(path, this.keys = [], options.sensitive);
this.middleware = options.middleware;
}



Route.prototype.match = function(path){
return this.regexp.exec(path);
};


