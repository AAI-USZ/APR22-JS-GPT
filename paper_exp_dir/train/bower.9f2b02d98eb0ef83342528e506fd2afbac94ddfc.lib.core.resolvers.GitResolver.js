var util = require('util');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mout = require('mout');
var Resolver = require('./Resolver');
var createError = require('../../util/createError');
var which = require('which');

var hasGit;


try {
which.sync('git');
hasGit = true;
} catch (ex) {
hasGit = false;
}

function GitResolver(source, options) {
Resolver.call(this, source, options);

