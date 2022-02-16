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
return p !== path && path.substr(0, p.length) === p;
})) {
watcher.add(path);
log.info('Watching "%s"', path);
}
});
};

exports.watch = function(patterns, fileList) {

var chokidarWatcher = new chokidar.FSWatcher();

watchPatterns(patterns, chokidarWatcher);

var bind = function(fn) {
return function(path) {
return fn.call(fileList, util.normalizeWinPath(path));
};
};


chokidarWatcher.on('add', bind(fileList.addFile))
.on('change', bind(fileList.changeFile))
.on('unlink', bind(fileList.removeFile));

return chokidarWatcher;
};
