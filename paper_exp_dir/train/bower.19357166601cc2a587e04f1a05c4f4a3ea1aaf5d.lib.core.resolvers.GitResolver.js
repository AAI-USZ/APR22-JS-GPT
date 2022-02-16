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


try {
which.sync('git');
hasGit = true;
} catch (ex) {
hasGit = false;
}

function GitResolver(decEndpoint, config, logger) {



mkdirp.sync(config.storage.empty);
process.env.GIT_TEMPLATE_DIR = config.storage.empty;

if (!config.strictSsl) {
process.env.GIT_SSL_NO_VERIFY = 'true';
}

if (!config.interactive) {
process.env.GIT_TERMINAL_PROMPT = '0';

if (!process.env.SSH_ASKPASS) {
process.env.SSH_ASKPASS = 'echo';
}
}

Resolver.call(this, decEndpoint, config, logger);

if (!hasGit) {
throw createError('git is not installed or not in the PATH', 'ENOGIT');
}
}

util.inherits(GitResolver, Resolver);
mout.object.mixIn(GitResolver, Resolver);



GitResolver.prototype._hasNew = function (pkgMeta) {
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



if (!versions.length && target === '*') {
return that._findResolution('master');
}

versionsArr = versions.map(function (obj) { return obj.version; });


index = semver.maxSatisfyingIndex(versionsArr, target, true);
if (index !== -1) {
version = versions[index];
