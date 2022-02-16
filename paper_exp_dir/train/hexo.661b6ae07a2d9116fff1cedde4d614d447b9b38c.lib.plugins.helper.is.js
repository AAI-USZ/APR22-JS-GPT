'use strict';

function isCurrentHelper(path = '/', strict) {
const currentPath = this.path.replace(/^[^/].*/, '/$&');

if (strict) {
if (path[path.length - 1] === '/') path += 'index.html';
path = path.replace(/^[^/].*/, '/$&');

return currentPath === path;
}

path = path.replace(/\/index\.html$/, '/');
