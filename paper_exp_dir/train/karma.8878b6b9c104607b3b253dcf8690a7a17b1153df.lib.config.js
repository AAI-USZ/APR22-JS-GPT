
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


var parseConfig = function(configFilePath, cliOptions) {

var config = {

port: constant.DEFAULT_PORT,
runnerPort: constant.DEFAULT_RUNNER_PORT,
basePath: path.dirname(configFilePath),
files: [],
exclude: [],
logLevel: constant.LOG_INFO,
logColors: true,
autoWatch: false,
autoWatchInterval: 0,


LOG_DISABLE: constant.LOG_DISABLE,
LOG_ERROR:   constant.LOG_ERROR,
LOG_WARN:    constant.LOG_WARN,
LOG_INFO:    constant.LOG_INFO,
LOG_DEBUG:   constant.LOG_DEBUG,
JASMINE: __dirname + '/../adapter/lib/jasmine.js',
JASMINE_ADAPTER: __dirname + '/../adapter/jasmine.js'
};

try {
vm.runInNewContext(fs.readFileSync(configFilePath), config);
} catch(e) {
if (e.name === 'SyntaxError') {
log.error('Syntax error in config file!');
throw e;
}

log.error('Config file does not exist!');
process.exit(1);
}



config.basePath = path.resolve(path.dirname(configFilePath), config.basePath);

var basePathResolve = function(relativePath) {
return path.resolve(config.basePath, relativePath);
};

config.files = config.files.map(basePathResolve);
config.exclude = config.exclude.map(basePathResolve);


return util.merge(config, cliOptions || {});
};



var FileGuardian = function(filePatterns, excludePatterns, emitter, autoWatch, autoWatchInterval) {
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
emitter.emit('file_modified', file);
}
});
});
}
});
};



exports.parseConfig = parseConfig;
exports.FileGuardian = FileGuardian;
