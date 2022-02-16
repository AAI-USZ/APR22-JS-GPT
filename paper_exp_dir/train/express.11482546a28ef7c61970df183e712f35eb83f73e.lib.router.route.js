




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



function normalize(path, keys, sensitive) {
if (path instanceof RegExp) return path;
path = path
.concat('/?')
.replace(/\/\(/g, '(?:/')
.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
keys.push({ name: key, optional: !! optional });
slash = slash || '';
return ''
+ (optional ? '' : slash)
+ '(?:'
+ (optional ? slash : '')
+ (format || '') + (capture || '([^/]+?)') + ')'
+ (optional || '');
})
.replace(/([\/.])/g, '\\$1')
.replace(/\*/g, '(.+)');
return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}
