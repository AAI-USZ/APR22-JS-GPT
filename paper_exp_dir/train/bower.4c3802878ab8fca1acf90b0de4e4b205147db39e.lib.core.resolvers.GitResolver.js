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

GitResolver.fetchRefs = function (source) {
throw new Error('fetchRefs not implemented');
};



GitResolver.prototype._findResolution = function (target) {
var err;
var self = this.constructor;

target = target || this._target || '*';



if ((/^[a-f0-9]{40}$/).test(target)) {
this._resolution = { type: 'commit', commit: target };
return Q.resolve(this._resolution);
}


if (semver.valid(target) != null || semver.validRange(target) != null) {
return self.versions(this._source, true)
.then(function (versions) {


if (!versions.length && target === '*') {
return this._findResolution('master');
}


var version = mout.array.find(versions, function (version) {
return semver.satisfies(version.version, target);
}, this);

if (!version) {
throw createError('No tag found that was able to satisfy ' + target, 'ENORESTARGET', {
details: !versions.length ?
'No versions found in ' + this._source :
'Available versions: ' + versions.map(function (version) { return version.version; }).join(', ')
});
}

return this._resolution = { type: 'version', tag: version.tag, commit: version.commit };
}.bind(this));
}



return self.tags(this._source)
.then(function (tags) {
if (mout.object.hasOwn(tags, target)) {
return this._resolution = { type: 'tag', tag: target, commit: tags[target] };
}


return self.branches(this._source)
.then(function (branches) {

if (!mout.object.hasOwn(branches, target)) {
branches = Object.keys(branches);
tags = Object.keys(tags);

err = createError('Tag/branch ' + target + ' does not exist', 'ENORESTARGET');
err.details = !tags.length ?
'No tags found in ' + this._source :
'Available tags: ' + tags.join(', ');
err.details += '\n';
err.details += !branches.length ?
'No branches found in ' + this._source :
'Available branches: ' + branches.join(', ');

throw err;
}

return this._resolution = { type: 'branch', branch: target, commit: branches[target] };
}.bind(this));
}.bind(this));
};

GitResolver.prototype._cleanup = function () {
var gitFolder = path.join(this._tempDir, '.git');




if (process.platform === 'win32') {
return Q.nfcall(chmodr, gitFolder, 0777)
.then(function () {
return Q.nfcall(rimraf, gitFolder);
}, function (err) {


if (err.code !== 'ENOENT') {
throw err;
}
});
} else {
return Q.nfcall(rimraf, gitFolder);
}
};

GitResolver.prototype._savePkgMeta = function (meta) {
var version;

if (this._resolution.type === 'version') {
version = semver.clean(this._resolution.tag);


if (typeof meta.version === 'string' && semver.neq(meta.version, version)) {
this._logger.warn('mismatch', 'Version declared in the json (' + meta.version + ') is different than the resolved one (' + version + ')', {
resolution: this._resolution,
pkgMeta: meta
});
}


meta.version = version;
} else {


delete meta.version;
}


meta._release = version || this._resolution.tag || this._resolution.commit.substr(0, 10);


meta._resolution = this._resolution;

return Resolver.prototype._savePkgMeta.call(this, meta);
};



GitResolver.versions = function (source, extra) {
if (this._versions && this._versions[source]) {
return Q.resolve(this._versions[source])
