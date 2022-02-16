var util = require('util');
var path = require('path');
var Q = require('q');
var rimraf = require('../../util/rimraf');
var mkdirp = require('mkdirp');
var which = require('which');
var LRU = require('lru-cache');
var mout = require('mout');
var Resolver = require('./Resolver');
var semver = require('../../util/semver');
var createError = require('../../util/createError');

var hasGit;
