var fs = require('fs');
var glob = require('glob');
var mm = require('minimatch');
var q = require('q');

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


var byPath = function(a, b) {
if (a.path > b.path) {
return 1;
}
if (a.path < b.path) {
return -1;
}
return 0;
};




var List = function(patterns, excludes, emitter, preprocess, batchInterval) {
var self = this;
var pendingDeferred;
var pendingTimeout;

var resolveFiles = function(buckets) {
var uniqueMap = {};
var files = {
served: [],
included: []
};

buckets.forEach(function(bucket, idx) {
bucket.sort(byPath).forEach(function(file) {
if (!uniqueMap[file.path]) {
if (patterns[idx].served) {
files.served.push(file);
}

if (patterns[idx].included) {
files.included.push(file);
}

uniqueMap[file.path] = true;
}
});
});

return files;
};

var resolveDeferred = function(files) {
if (pendingTimeout) {
clearTimeout(pendingTimeout);
}

pendingDeferred.resolve(files || resolveFiles(self.buckets));
pendingDeferred = pendingTimeout = null;
};

var fireEventAndDefer = function() {
if (pendingTimeout) {
clearTimeout(pendingTimeout);
}

if (!pendingDeferred) {
pendingDeferred = q.defer();
emitter.emit('file_list_modified', pendingDeferred.promise);
}

pendingTimeout = setTimeout(resolveDeferred, batchInterval);
};



this.refresh = function() {

var buckets = self.buckets = new Array(patterns.length);

var complete = function() {
if (buckets !== self.buckets) {
return;
}

var files = resolveFiles(buckets);

resolveDeferred(files);
log.debug('Resolved files:\n\t' + files.served.join('\n\t'));
};


var pending = 0;
var finish = function() {
pending--;

if (!pending) {
complete();
}
};

if (!pendingDeferred) {
pendingDeferred = q.defer();
emitter.emit('file_list_modified', pendingDeferred.promise);
}

if (pendingTimeout) {
clearTimeout(pendingTimeout);
}

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
if (error) {
log.debug('An error occured while reading "%s"', path);
finish();
} else {
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

return pendingDeferred.promise;
};




this.reload = function(newPatterns, newExcludes) {
patterns = newPatterns;
excludes = newExcludes;

return this.refresh();
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

var addedFile = new File(path);
buckets[i].push(addedFile);

return fs.stat(path, function(err, stat) {

if (self.buckets === buckets) {
addedFile.mtime = stat.mtime;

return preprocess(addedFile, function() {

