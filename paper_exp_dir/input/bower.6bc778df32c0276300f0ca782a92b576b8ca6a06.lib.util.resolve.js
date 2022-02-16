var requireg = require('requireg');
var resolve = require('resolve');

function startsWith(string, searchString, position) {
position = position || 0;
return string.substr(position, searchString.length) === searchString;

var resolvedPath;

var cwd = (options || {}).cwd || process.cwd();

try {
resolvedPath = resolve.sync(id, { basedir: cwd });
} catch (e) {

resolvedPath = requireg.resolve(id);
}

return resolvedPath;
