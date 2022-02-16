var fs = require('../lib/util/fs');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('../lib/util/rimraf');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var cmd = require('../lib/util/cmd');
var packages = require('./packages.json');
var nopt = require('nopt');

var options = nopt(
{
force: Boolean
},
{
f: '--force'
}
);

var env = {
