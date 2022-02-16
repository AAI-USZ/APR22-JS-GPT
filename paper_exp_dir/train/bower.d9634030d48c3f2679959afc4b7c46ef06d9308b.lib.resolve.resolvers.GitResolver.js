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
.then(this._checkout.bind(this))
.then(this._cleanup.bind(this));
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
var branches,
self = this.constructor;

target = target || this._target;


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
'Available versions in "' + this._source + '" are: ' + versions.map(function (version) { return version.version; }).join(', ')
});
}

return this._resolution = { type: 'tag', tag: version.tag, commit: version.commit };
}.bind(this));
}



if ((/^[a-f0-9]{40}$/).test(target)) {
this._resolution = { type: 'commit', commit: target };
return Q.resolve(this._resolution);
}


return self.fetchHeads(this._source)
.then(function (heads) {

if (!mout.object.hasOwn(heads, target)) {
branches = Object.keys(heads);
throw createError('Branch "' + target + '" does not exist', 'ENORESTARGET', {
details: !branches.length ?
'No branches found in "' + this._source + '"' :
'Available branches in "' + this._source + '" are: ' + branches.join(', ')
});
}

return this._resolution = { type: 'branch', branch: target, commit: heads[target] };
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




meta.version = this._resolution.version;


meta._resolution = this._resolution;

return Resolver.prototype._savePkgMeta.call(this, meta);
};



GitResolver.fetchVersions = function (source) {
if (this._versions && this._versions[source]) {
return Q.resolve(this._versions[source]);
}

return this.fetchRefs(source)
.then(function (refs) {
var versions = [];


refs.forEach(function (line) {
var match = line.match(/^([a-f0-9]{40})\s+refs\/tags\/(\S+)/),
tag,
version;


if (match) {
tag = match[2];
version = semver.clean(tag);
if (version) {
versions.push({ version: version, tag: tag, commit: match[1] });
}
}
});


versions = versions.sort(function (a, b) {
return semver.gt(a.version, b.version) ? -1 : 1;
});

this._versions = this._versions  || {};
return this._versions[source] = versions;
}.bind(this));
};

GitResolver.fetchHeads = function (source) {
if (this._heads && this._heads[source]) {
return Q.resolve(this._heads[source]);
}

return  this.fetchRefs(source)
.then(function (refs) {
this._heads = this._heads || {};
var heads = this._heads[source] = this._heads[source] || {};




refs.forEach(function (line) {
var match = line.match(/^([a-f0-9]{40})\s+refs\/heads\/(\S+)/);

if (match) {
heads[match[2]] = match[1];
}
});

return heads;
}.bind(this));
};

module.exports = GitResolver;
