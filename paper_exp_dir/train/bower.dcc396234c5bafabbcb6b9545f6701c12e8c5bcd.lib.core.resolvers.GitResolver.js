var util = require('util');
var path = require('path');
var Q = require('q');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var which = require('which');
var LRU = require('lru-cache');
var mout = require('mout');
var Resolver = require('./Resolver');
var semver = require('../../util/semver');
var createError = require('../../util/createError');
var defaultConfig = require('../../config');

var hasGit;


try {
which.sync('git');
hasGit = true;
} catch (ex) {
hasGit = false;
}




mkdirp.sync(defaultConfig.storage.empty);
process.env.GIT_TEMPLATE_DIR = defaultConfig.storage.empty;

function GitResolver(decEndpoint, config, logger) {
Resolver.call(this, decEndpoint, config, logger);

if (!hasGit) {
throw createError('git is not installed or not in the PATH', 'ENOGIT');
}
}

util.inherits(GitResolver, Resolver);
mout.object.mixIn(GitResolver, Resolver);



GitResolver.prototype._hasNew = function (canonicalDir, pkgMeta) {
var oldResolution = pkgMeta._resolution || {};

return this._findResolution()
.then(function (resolution) {

if (oldResolution.type !== resolution.type) {
return true;
}


if (resolution.type === 'version' && semver.neq(resolution.tag, oldResolution.tag)) {
return true;
}


return resolution.commit !== oldResolution.commit;
});
};

GitResolver.prototype._resolve = function () {
var that = this;

return this._findResolution()
.then(function () {
return that._checkout()



.fin(function () {
return that._cleanup();
});
});
};




GitResolver.prototype._checkout = function () {
throw new Error('_checkout not implemented');
};

GitResolver.refs = function (source) {
throw new Error('refs not implemented');
};



GitResolver.prototype._findResolution = function (target) {
var err;
var self = this.constructor;
var that = this;

target = target || this._target || '*';



if ((/^[a-f0-9]{40}$/).test(target)) {
this._resolution = { type: 'commit', commit: target };
return Q.resolve(this._resolution);
}


if (semver.validRange(target)) {
return self.versions(this._source, true)
.then(function (versions) {
var versionsArr,
version,
index;

versionsArr = versions.map(function (obj) { return obj.version; });



if (!versions.length && target === '*') {
return that._findResolution('master');
}

versionsArr = versions.map(function (obj) { return obj.version; });


index = semver.maxSatisfyingIndex(versionsArr, target, true);
if (index !== -1) {
version = versions[index];
return that._resolution = { type: 'version', tag: version.tag, commit: version.commit };
}


return Q.all([
self.branches(that._source),
self.tags(that._source)
])
.spread(function (branches, tags) {

if (mout.object.hasOwn(tags, target)) {
return that._resolution = { type: 'tag', tag: target, commit: tags[target] };
}
if (mout.object.hasOwn(branches, target)) {
