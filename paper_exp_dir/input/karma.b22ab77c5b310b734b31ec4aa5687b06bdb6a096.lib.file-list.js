var glob = require('glob');
var mm = require('minimatch');
var fs = require('fs');
var helper = require('./helper');
var log = require('./logger').create('watcher');


var createWinGlob = function(realGlob) {
return function(pattern, options, done) {
realGlob(pattern, options, function(err, results) {
done(err, results.map(helper.normalizeWinPath));
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
log.debug('Resolved files:\n\t' + self.getServedFiles().join('\n\t'));

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

patterns.forEach(function(patternObject, i) {
var pattern = patternObject.pattern;

if (helper.isUrlAbsolute(pattern)) {
buckets[i] = [new Url(pattern)];
return;
}

pending++;
glob(pattern, GLOB_OPTS, function(err, resolvedFiles) {
var matchedAndNotIgnored = 0;

buckets[i] = [];

if (!resolvedFiles.length) {
log.warn('Pattern "%s" does not match any file.', pattern);
return finish();
}


resolvedFiles.forEach(function(path) {
var matchExclude = function(excludePattern) {
return mm(path, excludePattern);
};

if (excludes.some(matchExclude)) {
log.debug('Excluded file "%s"', path);
return;
}

pending++;
matchedAndNotIgnored++;
fs.stat(path, function(error, stat) {
if (!stat.isDirectory()) {

var file = new File(path, stat.mtime);

buckets[i].push(file);
finish();
});
} else {
log.debug('Ignored directory "%s"', path);
finish();
}
});
});

if (!matchedAndNotIgnored) {
log.warn('All files matched by "%s" were excluded.', pattern);
}

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

var byPath = function(a, b) {
return a.path > b.path;
};

this.getFiles = function(filter) {
var files = [];
var uniqueMap = {};

this.buckets.forEach(function(bucket, idx) {
if (!filter(patterns[idx])) {
return;
}

bucket.sort(byPath).forEach(function(file) {
if (!uniqueMap[file.path]) {
files.push(file);
uniqueMap[file.path] = true;
}
});
});

return files;
};


this.getServedFiles = function() {
return this.getFiles(function(pattern) {
return pattern.served;
});
};


this.getIncludedFiles = function() {
return this.getFiles(function(pattern) {
return pattern.included;
});
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
if (mm(path, patterns[i].pattern)) {
for (j = 0; j < buckets[i].length; j++) {
if (buckets[i][j].originalPath === path) {
log.debug('Add file "%s" ignored. Already in the list.', path);
return done();
}
}

break;
}
}

if (i >= patterns.length) {
log.debug('Add file "%s" ignored. Does not match any pattern.', path);
return done();
}

return fs.stat(path, function(err, stat) {

if (self.buckets === buckets) {
var file = new File(path, stat.mtime);


buckets[i].push(file);
log.info('Added file "%s".', path);
emitter.emit('file_list_modified', self);
done();
});
}

return done();
});
};



this.changeFile = function(path, done) {
var buckets = this.buckets;
var i, j;


done = done || function() {};

outer: for (i = 0; i < buckets.length; i++) {
for (j = 0; j < buckets[i].length; j++) {
if (buckets[i][j].originalPath === path) {
break outer;
}
}
}

if (!buckets[i]) {
log.debug('Changed file "%s" ignored. Does not match any file in the list.', path);
return done();
}

return fs.stat(path, function(err, stat) {

if (err || !stat) {
return self.removeFile(path, done);
}

var file = buckets[i][j];
if (self.buckets === buckets && stat.mtime > file.mtime) {
file.mtime = stat.mtime;
log.info('Changed file "%s".', path);
