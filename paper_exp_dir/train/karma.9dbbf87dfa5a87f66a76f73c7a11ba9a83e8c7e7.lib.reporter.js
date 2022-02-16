var util = require('util');
var u = require('./util');

var createErrorFormatter = function(basePath) {
var URL_REGEXP = /http:\/\/[^\/]*\/(base|absolute)([^\?\s]*)(\?[0-9]*)?/g;

return function(msg, indentation) {


msg = msg.replace(URL_REGEXP, function(full, prefix, path) {
if (prefix === 'base') {
return basePath + path;
} else if (prefix === 'absolute') {
return path;
