var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');

var ResolveCache = function (dir) {





this._dir = dir;
this._versions = {};

mkdirp.sync(dir);
};

ResolveCache.prototype.retrieve = function (source, target) {
var sourceId = this._getSourceId(source);
var dir = path.join(this._dir, sourceId);

target = target || '*';

return this._getVersions(source)
.then(function (versions) {
var suitable;


if (semver.valid(target) != null || semver.validRange(target) != null) {
suitable = mout.array.find(versions, function (version) {
return semver.satisfies(version, target);
});

if (suitable) {
return suitable;
}
}

