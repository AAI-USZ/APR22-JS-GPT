'use strict';

function isCurrentHelper(path, strict) {
path = path || '/';
var currentPath = this.path.replace(/^[^\/].*/, function(_) {
return '/' + _
});

if (strict) {
if (path[path.length - 1] === '/') path += 'index.html';
path = path.replace(/^[^\/].*/, function(_) {
return '/' + _
})
return currentPath === path;
