var util = require('hexo-util');
var escape = util.escape;

var regexCache = {
home: {},
post: {}
};

exports.current = function(path, strict){
if (strict){
if (path[path.length - 1] === '/') path += 'index.html';

return this.path === path;
