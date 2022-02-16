
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

if (pointer === parts.length) results.push({path: path, mtime: stat.mtime});
return finish();
}
});
};

return processPath(parts[0], 1);
};


var resolve = function(patterns, done) {
var resultSets = new Array(patterns.length);
var waiting = 0;

patterns.forEach(function(pattern, index) {
waiting++;

resolveSinglePattern(pattern, function(err, files) {
resultSets[index] = files;
waiting--;

if (!waiting) {
var uniquePaths = [];
var uniqueResults = [];


resultSets.forEach(function(set) {
set.forEach(function(file) {


if (uniquePaths.indexOf(file.path) === -1) {
log.debug('Resolved file ' + file.path);
uniquePaths.push(file.path);
uniqueResults.push(file);
}
});
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

try {
vm.runInNewContext(fs.readFileSync(configFilePath), config);
} catch(e) {
if (e.name === 'SyntaxError') {
log.error('Syntax error in config file!');
} else {
log.error('Config file does not exist!');
}

throw e;
