var chokidar = require('chokidar');
var util = require('./util');
var log = require('./logger').create('watcher');


var baseDirFromPattern = function(pattern) {
return pattern.replace(/\/[^\/]*[\*\(].*$/, '') || '/';
};

var watchPatterns = function(patterns, watcher) {


var pathsToWatchMap = {};
patterns.forEach(function(pattern, i) {
if (!util.isUrlAbsolute(pattern)) {
pathsToWatchMap[baseDirFromPattern(pattern)] = true;
}
});


var pathsToWatch = Object.getOwnPropertyNames(pathsToWatchMap);
pathsToWatch.forEach(function(path) {
if (!pathsToWatch.some(function(p) {
