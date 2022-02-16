var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var LRU = require('lru-cache');
var createError = require('../util/createError');

function ResolveCache(config) {





this._config = config;
this._dir = this._config.roaming.cache;

this._cache = this.constructor._cache.get(this._dir);
if (!this._cache) {
