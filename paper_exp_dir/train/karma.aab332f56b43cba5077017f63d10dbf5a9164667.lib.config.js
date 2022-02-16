
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var EventEmitter = require('events').EventEmitter;


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
