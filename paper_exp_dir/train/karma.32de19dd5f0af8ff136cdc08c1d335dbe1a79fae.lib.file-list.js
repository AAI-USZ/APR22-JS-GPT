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
