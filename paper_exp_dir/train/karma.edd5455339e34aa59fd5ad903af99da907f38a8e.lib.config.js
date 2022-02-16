
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var log = require('./logger').create('config');
var util = require('./util');
var constant = require('./constants');


var resolveSinglePattern = function(pattern, done) {
var parts = [];
var results = [];
var waiting = 0;





pattern.split(/(\/[^\/\*]*\*[^\/\*]*)/).forEach(function(str) {
if (str) parts.push(str);
});


var finish = function() {
waiting--;
if (!waiting) {


results.sort(function(a, b) {
return a.path > b.path;
});
done(null, results);
}
};


var processPath = function(path, pointer) {
waiting++;

fs.stat(path, function(err, stat) {
if (err) return finish();
if (stat.isDirectory()) {

if (pointer === parts.length) return finish();

var regexp = new RegExp('^' +
parts[pointer].substr(1).
replace(/\./g, '\\.').
replace(/\*/g, '.*') + '$');

fs.readdir(path, function(err, files) {
files.forEach(function(file) {

if (regexp.test(file)) processPath(path + '/' + file, pointer + 1);
});
return finish();
});
return null;
} else {

if (pointer === parts.length) results.push({path: path, mtime: stat.mtime, isUrl: false});
return finish();
}
});
};

return processPath(parts[0], 1);
};


var resolve = function(patterns, exclude, done) {
var resultSets = new Array(patterns.length);
var waiting = 0;

var excludeRegExps = exclude.map(function(pattern) {

return new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
});

patterns.forEach(function(pattern, index) {


if (util.isUrlAbsolute(pattern)) {
resultSets[index] = [{path: pattern, isUrl: true, mtime: null}];
return;
}

waiting++;

resolveSinglePattern(pattern, function(err, files) {
if (!files.length) {
log.warn('Pattern "%s" does not match any file', pattern);
}

resultSets[index] = files;
waiting--;

if (!waiting) {
var uniquePaths = [];
var uniqueResults = [];


resultSets.forEach(function(set) {
set.forEach(function(file) {
if (uniquePaths.indexOf(file.path) === -1) {
uniquePaths.push(file.path);


if (excludeRegExps.some(function(exclude) {
return exclude.test(file.path);
})) {
log.debug('Excluded file ' + file.path);
} else {
uniqueResults.push(file);
log.debug('Resolved %s %s', file.isUrl ? 'url' : 'file', file.path);
}
}
});
});

done(null, uniqueResults);
}
});
});
};


var parseConfig = function(configFilePath, cliOptions) {

var config = {

port: constant.DEFAULT_PORT,
runnerPort: constant.DEFAULT_RUNNER_PORT,
basePath: path.dirname(configFilePath),
files: [],
exclude: [],
logLevel: constant.LOG_INFO,
colors: true,
autoWatch: false,
autoWatchInterval: 0,
reporter: 'progress',


LOG_DISABLE: constant.LOG_DISABLE,
LOG_ERROR:   constant.LOG_ERROR,
LOG_WARN:    constant.LOG_WARN,
LOG_INFO:    constant.LOG_INFO,
LOG_DEBUG:   constant.LOG_DEBUG,
JASMINE: __dirname + '/../adapter/lib/jasmine.js',
JASMINE_ADAPTER: __dirname + '/../adapter/jasmine.js',


console: console,
require: require
};

try {
vm.runInNewContext(fs.readFileSync(configFilePath), config);
} catch(e) {
if (e.name === 'SyntaxError') {
log.error('Syntax error in config file!\n' + e.message);
} else if (e.code === 'ENOENT' || e.code === 'EISDIR') {
