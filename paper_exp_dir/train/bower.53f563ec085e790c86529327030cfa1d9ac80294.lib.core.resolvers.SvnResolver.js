var util = require('util');
var path = require('path');
var Q = require('q');
var rimraf = require('rimraf');
var which = require('which');
var LRU = require('lru-cache');
var mout = require('mout');
var Resolver = require('./Resolver');
var semver = require('../../util/semver');
var createError = require('../../util/createError');
var cmd = require('../../util/cmd');

var hasSvn;


try {
which.sync('svn');
hasSvn = true;
} catch (ex) {
hasSvn = false;
}

function SvnResolver(decEndpoint, config, logger) {
Resolver.call(this, decEndpoint, config, logger);

if (!hasSvn) {
throw createError('svn is not installed or not in the PATH', 'ENOSVN');
}
}

util.inherits(SvnResolver, Resolver);
mout.object.mixIn(SvnResolver, Resolver);



SvnResolver.prototype._hasNew = function (canonicalDir, pkgMeta) {
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

SvnResolver.prototype._resolve = function () {
var that = this;

return this._findResolution()
.then(function () {
return that._checkout()



.fin(function () {
return that._cleanup();
});
});
};




SvnResolver.prototype._checkout = function () {
throw new Error('_checkout not implemented');
};



SvnResolver.prototype._findResolution = function (target) {
var err;
var self = this.constructor;
var that = this;

target = target || this._target || '*';


this._source = SvnResolver.sourceUrl(this._source);



if ((/^r\d+/).test(target)) {
target = target.split('r');

this._resolution = { type: 'commit', commit: target[1] };
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
return that._findResolution('trunk');
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


return Q.all([
self.branches(that._source),
self.tags(that._source)
])
.spread(function (branches, tags) {

if (mout.object.hasOwn(tags, target)) {
return that._resolution = { type: 'tag', tag: target, commit: tags[target] };
}
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
};

SvnResolver.prototype._cleanup = function () {
var svnFolder = path.join(this._tempDir, '.svn');

return Q.nfcall(rimraf, svnFolder);
};

SvnResolver.prototype._savePkgMeta = function (meta) {
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
this._resolution.commit;


meta._resolution = this._resolution;

return Resolver.prototype._savePkgMeta.call(this, meta);
};



SvnResolver.versions = function (source, extra) {

source = SvnResolver.sourceUrl(source);

var value = this._cache.versions.get(source);

if (value) {
return Q.resolve(value)
.then(function () {
var versions = this._cache.versions.get(source);



if (!extra) {
versions = versions.map(function (version) {
return version.version;
});
}

return versions;
}.bind(this));
}

value = this.tags(source)
.then(function (tags) {
var tag;
var version;
var versions = [];


for (tag in tags) {
version = semver.clean(tag);
if (version) {
versions.push({ version: version, tag: tag, commit: tags[tag] });
}
}


versions.sort(function (a, b) {
return semver.rcompare(a.version, b.version);
});

this._cache.versions.set(source, versions);


return this.versions(source, extra);
}.bind(this));



this._cache.versions.set(source, value);

return value;
};

SvnResolver.tags = function (source) {

source = SvnResolver.sourceUrl(source);

var value = this._cache.tags.get(source);

if (value) {
return Q.resolve(value);
}

value = cmd('svn', ['list', source + '/tags', '--verbose'])
.spread(function (stout) {
var tags = {};

var lines = stout.toString()
.trim()
.split(/[\r\n]+/);


lines.forEach(function (line) {

var match = line.match(/\s+([0-9]+)\s.+\s([a-z0-9.]+)\

if (match && match[2] !== '.') {
tags[match[2]] = match[1];
}
});

this._cache.tags.set(source, tags);

return tags;
}.bind(this));



this._cache.tags.set(source, value);

return value;
};

SvnResolver.branches = function (source) {

source = SvnResolver.sourceUrl(source);

var value = this._cache.branches.get(source);

if (value) {
return Q.resolve(value);
}

value = cmd('svn', ['list', source + '/branches', '--verbose'])
.spread(function (stout) {

var branches = {
'trunk': '*'
};

var lines = stout.toString()
.trim()
.split(/[\r\n]+/);


lines.forEach(function (line) {

var match = line.match(/\s+([0-9]+)\s.+\s([a-z0-9.]+)\

if (match && match[2] !== '.') {
branches[match[2]] = match[1];
}
});

this._cache.branches.set(source, branches);

return branches;
}.bind(this));



this._cache.branches.set(source, value);

return value;
};

SvnResolver.clearRuntimeCache = function () {

mout.object.forOwn(SvnResolver._cache, function (lru) {
lru.reset();
});
};



SvnResolver.sourceUrl = function (source) {
return source
.replace(/^svn\+(https?|file):\/\
.replace('svn://', 'http://')
.replace(/\/+$/, '');
};

SvnResolver._cache = {
branches: new LRU({ max: 50, maxAge: 5 * 60 * 1000 }),
tags: new LRU({ max: 50, maxAge: 5 * 60 * 1000 }),
versions: new LRU({ max: 50, maxAge: 5 * 60 * 1000 })
};

module.exports = SvnResolver;
