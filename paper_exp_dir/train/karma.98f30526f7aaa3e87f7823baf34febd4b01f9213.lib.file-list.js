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



var List = function(patterns, excludes, emitter, preprocess) {
var batchInterval = 250;
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

