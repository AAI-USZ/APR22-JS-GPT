require('chalk').enabled = false;

var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var object = require('mout/object');
var fs = require('fs');
var glob = require('glob');
var os = require('os');
var which = require('which');
var path = require('path');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var spawnSync = require('spawn-sync');
var config = require('../lib/config');


Q.longStackSupport = true;


var env = {
'GIT_AUTHOR_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_AUTHOR_NAME': 'André Cruz',
'GIT_AUTHOR_EMAIL': 'amdfcruz@gmail.com',
'GIT_COMMITTER_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_COMMITTER_NAME': 'André Cruz',
'GIT_COMMITTER_EMAIL': 'amdfcruz@gmail.com',
'NODE_ENV': 'test'
};

object.mixIn(process.env, env);

var tmpLocation = path.join(
os.tmpdir ? os.tmpdir() : os.tmpDir(),
'bower-tests',
uuid.v4().slice(0, 8)
);
