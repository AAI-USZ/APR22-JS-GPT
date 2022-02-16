var glob = require('glob');
var mm = require('minimatch');
var fs = require('fs');
var util = require('./util');
var log = require('./logger').create('watcher');


var createWinGlob = function(realGlob) {
return function(pattern, options, done) {
realGlob(pattern, options, function(err, results) {
done(err, results.map(util.normalizeWinPath));
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

if (util.isUrlAbsolute(pattern)) {
buckets[i] = [new Url(pattern)];
return;
}

pending++;
