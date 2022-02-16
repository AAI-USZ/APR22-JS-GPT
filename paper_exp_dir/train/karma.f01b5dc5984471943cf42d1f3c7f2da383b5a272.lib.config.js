
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


var resolve = function(patterns, exclude, done) {
var resultSets = new Array(patterns.length);
var waiting = 0;

var excludeRegExps = exclude.map(function(pattern) {

return new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
});

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
uniquePaths.push(file.path);


if (excludeRegExps.some(function(exclude) {
return exclude.test(file.path);
})) {
log.debug('Excluded file ' + file.path);
} else {
uniqueResults.push(file);
log.debug('Resolved file ' + file.path);
}
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
exclude: [],
logLevel: 3,
logColors: true,
autoWatch: false,
autoWatchInterval: 0,


LOG_DISABLE: -1,
LOG_ERROR:    1,
LOG_WARN:     2,
LOG_INFO:     3,
LOG_DEBUG:    4,
JASMINE_ADAPTER: __dirname + '/../adapter/jasmine.js'
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
}



config.basePath = path.resolve(path.dirname(configFilePath), config.basePath);

var basePathResolve = function(relativePath) {
return path.resolve(config.basePath, relativePath);
};

config.files = config.files.map(basePathResolve);
config.exclude = config.exclude.map(basePathResolve);

return config;
};



var FileGuardian = function(filePatterns, excludePatterns, autoWatch, autoWatchInterval) {
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
var watchOptions = {interval: autoWatchInterval};
resolve(filePatterns, excludePatterns, function(err, files) {
files_ = files;

if (autoWatch) {

files.forEach(function(file) {
log.debug('Watching ', file.path);
fs.watchFile(file.path, watchOptions, function(current, previous) {


if (current.mtime > previous.mtime) {
log.info('Modified: ', file.path);
file.mtime = current.mtime;
self.emit('fileModified');
}
});
});
}
});
};


FileGuardian.prototype = new EventEmitter();



exports.parseConfig = parseConfig;
exports.FileGuardian = FileGuardian;
