var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var object = require('mout/object');
var fs = require('fs');
var glob = require('glob');
var os = require('os');
var cmd = require('../lib/util/cmd');
var config = require('../lib/config');


var env = {
'GIT_AUTHOR_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_AUTHOR_NAME': 'André Cruz',
'GIT_AUTHOR_EMAIL': 'amdfcruz@gmail.com',
'GIT_COMMITTER_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_COMMITTER_NAME': 'André Cruz',
'GIT_COMMITTER_EMAIL': 'amdfcruz@gmail.com'
};


object.mixIn(env, process.env);

var tmpLocation = path.join(
os.tmpdir ? os.tmpdir() : os.tmpDir(),
'bower-tests',
uuid.v4().slice(0, 8)
);

exports.require = function (name, stubs) {
if (stubs) {
return proxyquire(path.join(__dirname, '../', name), stubs);
} else {
return require(path.join(__dirname, '../', name));
}
};


beforeEach(function () {
config.reset();
});

after(function () {
rimraf.sync(tmpLocation);
});

exports.TempDir = (function() {
function TempDir (defaults) {
this.path = path.join(tmpLocation, uuid.v4());
this.defaults = defaults;
}

TempDir.prototype.create = function (files, defaults) {
var that = this;

defaults = defaults || this.defaults || {};
files = object.merge(files || {}, defaults);

