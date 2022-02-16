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

exports.require = function (name) {
return require(path.join(__dirname, '../', name));
};


beforeEach(function () {
