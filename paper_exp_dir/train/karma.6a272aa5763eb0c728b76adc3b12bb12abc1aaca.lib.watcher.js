var chokidar = require('chokidar');
var mm = require('minimatch');

var helper = require('./helper');
var log = require('./logger').create('watcher');

var DIR_SEP = require('path').sep;


var baseDirFromPattern = function(pattern) {
return pattern.replace(/\/[^\/]*[\*\(].*$/, '') || '/';
};

var watchPatterns = function(patterns, watcher) {

var pathsToWatch = [];
var uniqueMap = {};
var path;

patterns.forEach(function(pattern) {
path = baseDirFromPattern(pattern);
if (!uniqueMap[path]) {
uniqueMap[path] = true;
pathsToWatch.push(path);
}
});


pathsToWatch.forEach(function(path) {
if (!pathsToWatch.some(function(p) {
