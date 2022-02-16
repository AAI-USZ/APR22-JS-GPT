exports.is_current = function(path, strict){
if (strict){
if (path[path.length - 1] === '/') path += 'index.html';

return this.path === path;
} else {
path = path.replace(/\/index\.html$/, '/');

return this.path.substring(0, path.length) === path;
}
