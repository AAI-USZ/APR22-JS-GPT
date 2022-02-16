
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var EventEmitter = require('events').EventEmitter;
var log = require('./logger').create('config');


var resolveSinglePattern = function(pattern, done) {
var parts = [];
var results = [];
var waiting = 0;





pattern.split(/(\/[^\/\*]*\*[^\/\*]*)/).forEach(function(str) {
if (str) parts.push(str);
});


var finish = function() {
waiting--;
if (!waiting) return done(null, results);
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

if (pointer === parts.length) results.push({path: path, mtime: stat.mtime});
return finish();
}
});
};

return processPath(parts[0], 1);
};


var resolve = function(patterns, done) {
var results = [];
var waiting = 0;

patterns.forEach(function(pattern) {
waiting++;

resolveSinglePattern(pattern, function(err, files) {
results = results.concat(files);
waiting--;
if (!waiting) {
var uniquePaths = [],
uniqueResults = [];
results.forEach(function(file) {
if (uniquePaths.indexOf(file.path) === -1) {
log.debug('Resolved file ' + file.path);
uniquePaths.push(file.path);
uniqueResults.push(file);
}
});
done(null, uniqueResults);
}
});
});
};


var parseConfig = function(configFilePath) {

var config = {

port: 8080,
runnerPort: 1337,
basePath: '',
files: [],
logLevel: 3,
logColors: true,
autoWatch: false,


LOG_DISABLE: -1,
LOG_ERROR:    0,
LOG_WARN:     1,
LOG_INFO:     2,
LOG_DEBUG:    3
};



vm.runInNewContext(fs.readFileSync(configFilePath), config);


config.basePath = path.resolve(path.dirname(configFilePath), config.basePath);


config.files.forEach(function(filePath, i) {
config.files[i] = path.resolve(config.basePath, filePath);
});

return config;
};


var FileGuardian = function(filePatterns, autoWatch) {
var files_ = [];


this.getFiles = function() {
return files_;
};

this.checkModifications = function(done) {
var waiting = 0;
var modified = 0;

var finish = function() {
waiting--;
if (!waiting && done) done(modified);
};

log.debug('Checking files for modifications...');
files_.forEach(function(file) {
waiting++;
fs.stat(file.path, function(err, stat) {
if (file.mtime < stat.mtime) {
file.mtime = stat.mtime;
modified++;
log.info('Modified: ', file.path);
}
finish();
});
});
};


var self = this;
resolve(filePatterns, function(err, files) {
files_ = files;

if (autoWatch) {

files.forEach(function(file) {
log.debug('Watching ', file.path);
fs.watchFile(file.path, function(current, previous) {


if (current.mtime > previous.mtime) {
log.info('Modified: ', file.path);
file.mtime = current.mtime;
self.emit('fileModified');
