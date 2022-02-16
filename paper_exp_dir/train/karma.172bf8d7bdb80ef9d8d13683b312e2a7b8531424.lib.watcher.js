var chokidar = require('chokidar');
var mm = require('minimatch');

var helper = require('./helper');
var log = require('./logger').create('watcher');


var baseDirFromPattern = function(pattern) {
return pattern.replace(/\/[^\/]*[\*\(].*$/, '') || '/';
};

var watchPatterns = function(patterns, watcher) {

var pathsToWatch = [];
var uniqueMap = {};
var path;

patterns.forEach(function(patternObject) {
var pattern = patternObject.pattern;

if (!patternObject.watched) {
return;
}

path = baseDirFromPattern(pattern);
if (!uniqueMap[path]) {
uniqueMap[path] = true;
pathsToWatch.push(path);
}
});


pathsToWatch.forEach(function(path) {
if (!pathsToWatch.some(function(p) {
return p !== path && path.substr(0, p.length) === p;
})) {
watcher.add(path);
log.debug('Watching "%s"', path);
}
});
};




var createIgnore = function(excludes) {
return function(item) {
var matchExclude = function(pattern) {
log.debug('Excluding %s', pattern);
return mm(item, pattern, {dot: true});
};
return excludes.some(matchExclude);
};
};

exports.watch = function(patterns, excludes, fileList) {
var options = {
ignorePermissionErrors: true,
ignored: createIgnore(excludes)
};
var chokidarWatcher = new chokidar.FSWatcher(options);

watchPatterns(patterns, chokidarWatcher);

var bind = function(fn) {
return function(path) {
return fn.call(fileList, helper.normalizeWinPath(path));
};
};


chokidarWatcher.on('add', bind(fileList.addFile))
.on('change', bind(fileList.changeFile))
.on('unlink', bind(fileList.removeFile));

return chokidarWatcher;
};
