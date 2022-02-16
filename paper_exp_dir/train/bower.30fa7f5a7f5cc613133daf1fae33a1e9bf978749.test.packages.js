require('colors');
var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var cmd = require('../lib/util/cmd');
var packages = require('./packages.json');
var nopt = require('nopt');

var options = nopt({
'force': Boolean
}, {
'f': '--force'
});

var env = {
'GIT_AUTHOR_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_AUTHOR_NAME': 'André Cruz',
'GIT_AUTHOR_EMAIL': 'amdfcruz@gmail.com',
'GIT_COMMITTER_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_COMMITTER_NAME': 'André Cruz',
'GIT_COMMITTER_EMAIL': 'amdfcruz@gmail.com'
};


mout.object.mixIn(env, process.env);

function ensurePackage(dir) {
var promise;


if (options.force) {
promise = Q.nfcall(rimraf, dir)
.then(function () {
throw new Error();
