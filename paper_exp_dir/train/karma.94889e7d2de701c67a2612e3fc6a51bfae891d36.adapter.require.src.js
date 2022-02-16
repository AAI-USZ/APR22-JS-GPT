



var normalizePath = function(path) {
var normalized = [];
var parts = path.split('/');

for (var i = 0; i < parts.length; i++) {
if (parts[i] === '.') {
continue;
}

if (parts[i] === '..' && normalized.length && normalized[normalized.length - 1] !== '..') {
