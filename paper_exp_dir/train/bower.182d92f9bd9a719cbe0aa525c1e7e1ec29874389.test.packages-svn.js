var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var cmd = require('../lib/util/cmd');
var packages = require('./packages-svn.json');
var nopt = require('nopt');

var isWin = function() {
return process.platform === 'win32';
};

var pathToUrl = function (localPath) {
localPath = path.normalize(localPath);

if (!isWin()) {
localPath = 'file://' + localPath;
} else {
