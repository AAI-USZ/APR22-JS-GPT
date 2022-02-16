var chokidar = require('chokidar');
var util = require('./util');
var log = require('./logger').create('watcher');


var baseDirFromPattern = function(pattern) {
return pattern.replace(/\/[^\/]*[\*\(].*$/, '') || '/';
};

var watchPatterns = function(patterns, watcher) {


var pathsToWatch = [];
var uniqueMap = {};
var path;
patterns.forEach(function(patternObject, i) {
var pattern = patternObject.pattern;

if (!util.isUrlAbsolute(pattern)) {
path = baseDirFromPattern(pattern);
if (!uniqueMap[path]) {
uniqueMap[path] = true;
pathsToWatch.push(path);
}
}
