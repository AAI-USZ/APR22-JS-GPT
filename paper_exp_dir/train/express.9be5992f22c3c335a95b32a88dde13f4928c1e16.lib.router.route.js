




module.exports = Route;



function Route(method, path, fn) {
this.callback = fn;
this.path = path;
this.regexp = normalize(path, this.keys = []);
this.method = method;
this.params = [];
}



function normalize(path, keys) {
if (path instanceof RegExp) return path;
path = path
.concat('/?')
.replace(/\/\(/g, '(?:/')
.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
keys.push(key);
