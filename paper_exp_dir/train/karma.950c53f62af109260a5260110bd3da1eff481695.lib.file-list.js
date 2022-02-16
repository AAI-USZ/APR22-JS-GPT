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
this.mtime = mtime;
this.isUrl = false;
};

var Url = function(path) {
this.path = path;
this.isUrl = true;
}

Url.prototype.toString = File.prototype.toString = function() {
return this.path;
};


var GLOB_OPTS = {

cwd: '/'
};


var List = function(patterns, excludes, emitter) {
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

if (done) done();
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
buckets[i].push(new File(path, stat.mtime));
}

finish();
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


done = done || function() {};


for (var j = 0; j < excludes.length; j++) {
if (mm(path, excludes[j])) {
log.debug('Add file "%s" ignored. Excluded by "%s".', path, excludes[j]);
return done();
}
}

for (var i = 0; i < patterns.length; i++) {
if (mm(path, patterns[i])) {
for (var k = 0; k < buckets[i].length; k++) {
if (buckets[i][k].path === path) {
log.debug('Add file "%s" ignored. Already in the list.', path);
return done();
}
}

return fs.stat(path, function(err, stat) {


if (self.buckets === buckets) {
buckets[i].push(new File(path, stat.mtime));
log.info('Added file "%s".', path);
emitter.emit('file_list_modified', self);
}
return done();
});
}
}

log.debug('Add file "%s" ignored. Does not match any pattern.', path);
return done();
};



this.changeFile = function(path, done) {
var buckets = this.buckets;


done = done || function() {};

for (var i = 0; i < buckets.length; i++) {
for (var j = 0; j < buckets[i].length; j++) {
if (buckets[i][j].path === path) {
return fs.stat(path, function(err, stat) {

if (err || !stat) {
return self.removeFile(path, done);
}
if (self.buckets === buckets && stat.mtime > buckets[i][j].mtime) {
buckets[i][j].mtime = stat.mtime;
log.info('Changed file "%s".', path);
emitter.emit('file_list_modified', self);
}
return done();
});
