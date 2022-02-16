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

this.doNotCache = false;
};

var Url = function(path) {
this.path = path;
this.isUrl = true;
};

Url.prototype.toString = File.prototype.toString = function() {
