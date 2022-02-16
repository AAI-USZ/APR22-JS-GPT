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


return self.branches(that._source)
.then(function (branches) {

if (mout.object.hasOwn(branches, target)) {
return that._resolution = { type: 'branch', branch: target, commit: branches[target] };
}

throw createError('No tag found that was able to satisfy ' + target, 'ENORESTARGET', {
details: !versions.length ?
'No versions found in ' + that._source :
'Available versions: ' + versions.map(function (version) { return version.version; }).join(', ')
});
});
});
}



return self.tags(this._source)
.then(function (tags) {
if (mout.object.hasOwn(tags, target)) {
return that._resolution = { type: 'tag', tag: target, commit: tags[target] };
}


return self.branches(that._source)
.then(function (branches) {

if (mout.object.hasOwn(branches, target)) {
return that._resolution = { type: 'branch', branch: target, commit: branches[target] };
}

branches = Object.keys(branches);
tags = Object.keys(tags);

err = createError('Tag/branch ' + target + ' does not exist', 'ENORESTARGET');
err.details = !tags.length ?
'No tags found in ' + that._source :
'Available tags: ' + tags.join(', ');
err.details += '\n';
err.details += !branches.length ?
'No branches found in ' + that._source :
'Available branches: ' + branches.join(', ');

throw err;
});
});
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




meta._release = version ||
this._resolution.tag ||
this._resolution.commit.substr(0, 10);


meta._resolution = this._resolution;

return Resolver.prototype._savePkgMeta.call(this, meta);
};
