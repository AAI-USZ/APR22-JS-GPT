


var mime = require('connect').mime;



exports.locals = function(obj){
obj.viewCallbacks = obj.viewCallbacks || [];

function locals(obj){
for (var key in obj) locals[key] = obj[key];
return obj;
};

locals.use = function(fn){
if (3 == fn.length) {
obj.viewCallbacks.push(fn);
} else {
obj.viewCallbacks.push(function(req, res, done){
fn(req, res);
done();
});
}
return obj;
};

return locals;
};



exports.isAbsolute = function(path){
if ('/' == path[0]) return true;
if (':' == path[1] && '\\' == path[2]) return true;
};



exports.flatten = function(arr, ret){
var ret = ret || []
, len = arr.length;
for (var i = 0; i < len; ++i) {
if (Array.isArray(arr[i])) {
exports.flatten(arr[i], ret);
} else {
ret.push(arr[i]);
}
}
return ret;
};



exports.normalizeType = function(type){
return ~type.indexOf('/') ? type : mime.lookup(type);
};



exports.normalizeTypes = function(types){
var ret = [];

for (var i = 0; i < types.length; ++i) {
ret.push(~types[i].indexOf('/')
? types[i]
: mime.lookup(types[i]));
}

return ret;
};



exports.acceptsArray = function(types, str){

if (!str) return types[0];


var accepted = exports.parseAccept(str)
, normalized = exports.normalizeTypes(types)
, len = accepted.length;

for (var i = 0; i < len; ++i) {
for (var j = 0, jlen = types.length; j < jlen; ++j) {
if (exports.accept(normalized[j].split('/'), accepted[i])) {
return types[j];
}
}
}
};



exports.accepts = function(type, str){
if ('string' == typeof type) type = type.split(/ *, */);
return exports.acceptsArray(type, str);
};



exports.accept = function(type, other){
return (type[0] == other.type || '*' == other.type)
&& (type[1] == other.subtype || '*' == other.subtype);
};



exports.parseAccept = function(str){
return exports
.parseQuality(str)
.map(function(obj){
var parts = obj.value.split('/');
obj.type = parts[0];
obj.subtype = parts[1];
return obj;
});
};



exports.parseQuality = function(str){
return str
.split(/ *, */)
.map(quality)
.filter(function(obj){
return obj.quality;
})
.sort(function(a, b){
return b.quality - a.quality;
});
};



function quality(str) {
var parts = str.split(/ *; */)
, val = parts[0];

var q = parts[1]
? parseFloat(parts[1].split(/ *= */)[1])
: 1;

return { value: val, quality: q };
}



exports.escape = function(html) {
return String(html)
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;');
};

/**
* Normalize the given path string,
* returning a regular expression.
*
* An empty array should be passed,
* which will contain the placeholder
* key names. For example "/user/:id" will
* then contain ["id"].
*
* @param  {String|RegExp|Array} path
* @param  {Array} keys
* @param  {Boolean} sensitive
* @param  {Boolean} strict
* @return {RegExp}
* @api private
*/

exports.pathRegexp = function(path, keys, sensitive, strict) {
if (path instanceof RegExp) return path;
if (Array.isArray(path)) path = '(' + path.join('|') + ')';
path = path
.concat(strict ? '' : '/?')
.replace(/\/\(/g, '(?:/')
.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
keys.push({ name: key, optional: !! optional });
slash = slash || '';
return ''
+ (optional ? '' : slash)
+ '(?:'
+ (optional ? slash : '')
+ (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
+ (optional || '')
+ (star ? '(/*)' : '');
})
.replace(/([\/.])/g, '\\$1')
.replace(/\*/g, '(.*)');
return new RegExp('^' + path + '$', sensitive ? '' : 'i');
