var util = require('util');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var which = require('which');
var LRU = require('lru-cache');
var mout = require('mout');
var Resolver = require('./Resolver');
var createError = require('../../util/createError');
var defaultConfig = require('../../config');

var hasGit;


