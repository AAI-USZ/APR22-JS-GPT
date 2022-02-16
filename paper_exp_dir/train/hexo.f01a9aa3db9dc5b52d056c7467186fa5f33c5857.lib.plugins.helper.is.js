'use strict';

function isCurrentHelper(path, strict) {
path = path || '';

if (strict) {
if (path[path.length - 1] === '/') path += 'index.html';

return this.path === path;
}

path = path.replace(/\/index\.html$/, '/');

return this.path.substring(0, path.length) === path;
}

