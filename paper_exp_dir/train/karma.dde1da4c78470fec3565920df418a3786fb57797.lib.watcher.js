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
return p !== path && path.substr(0, p.length + 1) === p + DIR_SEP;
})) {
watcher.add(path);
log.debug('Watching "%s"', path);
}
});
};


var createIgnore = function(patterns, excludes) {
return function(path, stat) {
if (!stat || stat.isDirectory()) {
return false;
}


if (!patterns.some(function(pattern) {
return mm(path, pattern, {dot: true});
})) {
return true;
}


if (excludes.some(function(pattern) {
return mm(path, pattern, {dot: true});
})) {
return true;
}

return false;
};
};

var onlyWatchedTrue = function(pattern) {
return pattern.watched;
};

var getWatchedPatterns = function(patternObjects) {
return patternObjects.filter(onlyWatchedTrue).map(function(patternObject) {
return patternObject.pattern;
});
};

exports.watch = function(patterns, excludes, fileList) {
var watchedPatterns = getWatchedPatterns(patterns);
var options = {
ignorePermissionErrors: true,
ignoreInitial: true,
ignored: createIgnore(watchedPatterns, excludes)
};
var chokidarWatcher = new chokidar.FSWatcher(options);

watchPatterns(watchedPatterns, chokidarWatcher);

var bind = function(fn) {
return function(path) {
return fn.call(fileList, helper.normalizeWinPath(path));
