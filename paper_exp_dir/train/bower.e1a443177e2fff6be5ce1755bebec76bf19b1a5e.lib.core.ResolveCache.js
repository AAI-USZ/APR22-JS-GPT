var fs = require('graceful-fs');
var path = require('path');
var semver = require('semver');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var LRU = require('lru-cache');
var readJson = require('../util/readJson');
var copy = require('../util/copy');
var md5 = require('../util/md5');

function ResolveCache(config) {





this._config = config;
