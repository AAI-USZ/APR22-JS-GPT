var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var LRU = require('lru-cache');
var lockFile = require('lockfile');
var semver = require('../util/semver');
var readJson = require('../util/readJson');
var copy = require('../util/copy');
var md5 = require('../util/md5');

function ResolveCache(config) {





this._config = config;
this._dir = this._config.storage.packages;
