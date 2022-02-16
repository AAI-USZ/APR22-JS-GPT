var glob = require('glob');
var mm = require('minimatch');
var fs = require('fs');
var util = require('./util');
var log = require('./logger').create('watcher');


var createWinGlob = function(realGlob) {
return function(pattern, options, done) {
var drive = pattern.substr(0, 3);
realGlob(pattern.substr(3), options, function(err, results) {
done(err, results.map(function(path) {
return drive + path;
}));
});
};
};

if (process.platform === 'win32') {
glob = createWinGlob(glob);
}


var File = function(path, mtime) {

this.path = path;


this.originalPath = path;


this.contentPath = path;

this.mtime = mtime;
this.isUrl = false;
};

var Url = function(path) {
this.path = path;
this.isUrl = true;
};

Url.prototype.toString = File.prototype.toString = function() {
return this.path;
};


var GLOB_OPTS = {

cwd: '/'
};


var List = function(patterns, excludes, emitter, preprocess) {
var self = this;


this.refresh = function(done) {
var buckets = this.buckets = new Array(patterns.length);

var complete = function() {
log.debug('Resolved files:\n\t' + self.getFiles().join('\n\t'));

buckets.forEach(function(bucket, i) {
if (!bucket.length) {
log.warn('Pattern "%s" does not match any file.', patterns[i]);
}
});

if (done) {
done();
}
};


var pending = 0;
var finish = function() {
pending--;

if (!pending) {
complete();
}
};

patterns.forEach(function(pattern, i) {
if (util.isUrlAbsolute(pattern)) {
buckets[i] = [new Url(pattern)];
return;
}

pending++;
glob(pattern, GLOB_OPTS, function(err, resolvedFiles) {
buckets[i] = [];


resolvedFiles.forEach(function(path) {
var matchExclude = function(excludePattern) {
return mm(path, excludePattern);
};

if (excludes.some(matchExclude)) {
log.debug('Excluded file "%s"', path);
return;
}

pending++;
fs.stat(path, function(error, stat) {
if (!stat.isDirectory()) {

var file = new File(path, stat.mtime);

preprocess(file, function() {
buckets[i].push(file);
finish();
});
} else {
log.debug('Ignored directory "%s"', path);
finish();
}
});
});
finish();
});
});

if (!pending) {
process.nextTick(complete);
}
};




this.reload = function(newPatterns, newExcludes, done) {
patterns = newPatterns;
excludes = newExcludes;

this.refresh(done);
};



this.getFiles = function() {
var files = [];
var uniqueMap = {};

var byPath = function(a, b) {
return a.path > b.path;
};

this.buckets.forEach(function(bucket) {
bucket.sort(byPath).forEach(function(file) {
if (!uniqueMap[file.path]) {
files.push(file);
uniqueMap[file.path] = true;
}
});
});

return files;
};



this.addFile = function(path, done) {
var buckets = this.buckets;
var i, j;


done = done || function() {};


for (i = 0; i < excludes.length; i++) {
if (mm(path, excludes[i])) {
log.debug('Add file "%s" ignored. Excluded by "%s".', path, excludes[i]);
return done();
}
}

for (i = 0; i < patterns.length; i++) {
if (mm(path, patterns[i])) {
for (j = 0; j < buckets[i].length; j++) {
if (buckets[i][j].originalPath === path) {
log.debug('Add file "%s" ignored. Already in the list.', path);
return done();
}
}

break;
}
}

if (!patterns[i]) {
log.debug('Add file "%s" ignored. Does not match any pattern.', path);
return done();
}

return fs.stat(path, function(err, stat) {

if (self.buckets === buckets) {
