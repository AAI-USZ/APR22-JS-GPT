'use strict';

function isCurrentHelper(path = '/', strict) {
const currentPath = this.path.replace(/^[^\/].*/, _ =>
`/${_}`);

if (strict) {
if (path[path.length - 1] === '/') path += 'index.html';
path = path.replace(/^[^\/].*/, _ =>
`/${_}`);

return currentPath === path;
