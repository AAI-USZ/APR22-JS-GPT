var util = require('util');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mout = require('mout');
var Resolver = require('../Resolver');
var createError = require('../../util/createError');

var GitResolver = function (source, options) {
Resolver.call(this, source, options);


if (this._guessedName) {
this._name = path.basename(this._source, '.git');
}
};

util.inherits(GitResolver, Resolver);



GitResolver.prototype._resolveSelf = function () {
return this._findResolution()
.then(function () {
return this._checkout()



.fin(this._cleanup.bind(this));
}.bind(this));
};

GitResolver.prototype.hasNew = function (canonicalPkg) {
var oldResolution;

return this._readJson(canonicalPkg)
.then(function (meta) {
oldResolution = meta._resolution || {};
})
.then(this._findResolution.bind(this))
.then(function (resolution) {

if (oldResolution.type !== resolution.type) {
return true;
}


if (resolution.type === 'tag' && semver.neq(resolution.tag, oldResolution.tag)) {
return true;
}


return resolution.commit !== oldResolution.commit;
});
};




GitResolver.prototype._checkout = function () {
throw new Error('_checkout not implemented');
};
GitResolver.fetchRefs = function (source) {
throw new Error('fetchRefs not implemented');
};



GitResolver.prototype._findResolution = function (target) {
var self = this.constructor,
err;

target = target || this._target;



if ((/^[a-f0-9]{40}$/).test(target)) {
this._resolution = { type: 'commit', commit: target };
return Q.resolve(this._resolution);
}


if (semver.valid(target) != null || semver.validRange(target) != null) {
return self.fetchVersions(this._source)
.then(function (versions) {


if (!versions.length && target === '*') {
return this._findResolution('master');
}


var version = mout.array.find(versions, function (version) {
return semver.satisfies(version.version, target);
}, this);

if (!version) {
throw createError('No tag found that was able to satisfy "' + target + '"', 'ENORESTARGET', {
details: !versions.length ?
'No versions found in "' + this._source + '"' :
'Available versions: ' + versions.map(function (version) { return version.version; }).join(', ')
});
}

return this._resolution = { type: 'version', tag: version.tag, commit: version.commit };
}.bind(this));
}



return self.fetchTags(this._source)
.then(function (tags) {
if (mout.object.hasOwn(tags, target)) {
return this._resolution = { type: 'tag', tag: target, commit: tags[target] };
}


return self.fetchBranches(this._source)
.then(function (branches) {

if (!mout.object.hasOwn(branches, target)) {
branches = Object.keys(branches);
tags = Object.keys(tags);

err = createError('Tag/branch "' + target + '" does not exist', 'ENORESTARGET');
err.details = !tags.length ?
'No tags found in "' + this._source + '"' :
'Available tags: ' + tags.join(', ');
err.details += '\n';
err.details += !branches.length ?
'No branches found in "' + this._source + '"' :
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
var deferred = Q.defer();

if (this._resolution.version) {

if (typeof meta.version === 'string' && meta.version !== this._resolution.version) {
process.nextTick(function (metaVersion) {
deferred.notify({
type: 'warn',
data: 'Version declared in the json (' + metaVersion + ') is different than the resolved one (' + this._resolution.version + ')'
});
}.bind(this, meta.version));
}
