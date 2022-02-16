var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

function ResolveCache(config) {





this._config = config;
this._dir = this._config.roaming.cache;
this._versions = {};

mkdirp.sync(this._dir);
}



ResolveCache.prototype.retrieve = function (source, target) {
var sourceId = this._getSourceId(source);
