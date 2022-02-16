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
process.env.GIT_SSL_NO_VERIFY = (!config.strictSsl).toString();
process.env.GIT_TERMINAL_PROMPT = config.interactive ? '1' : '0';

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
return that._resolution = { type: 'branch', branch: target, commit: branches[target] };
}

throw createError('No tag found that was able to satisfy ' + target, 'ENORESTARGET', {
details: !versions.length ?
'No versions found in ' + that._source :
'Available versions in ' + that._source + ': ' + versions.map(function (version) { return version.version; }).join(', ')
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

if ((/^[a-f0-9]{4,40}$/).test(target)) {
if (target.length < 12) {
that._logger.warn(
'short-sha',
'Consider using longer commit SHA to avoid conflicts'
);
}

that._resolution = { type: 'commit', commit: target };
return that._resolution;
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

GitResolver.prototype._cleanup = function () {
var gitFolder = path.join(this._tempDir, '.git');

return Q.nfcall(rimraf, gitFolder);
};

GitResolver.prototype._savePkgMeta = function (meta) {
var version;

if (this._resolution.type === 'version') {
version = semver.clean(this._resolution.tag);


if (typeof meta.version === 'string' && semver.valid(meta.version) && semver.neq(meta.version, version)) {
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



GitResolver.versions = function (source, extra) {
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

GitResolver.tags = function (source) {
var value = this._cache.tags.get(source);

if (value) {
return Q.resolve(value);
}

value = this.refs(source)
.then(function (refs) {
var tags = {};


refs.forEach(function (line) {
var match = line.match(/^([a-f0-9]{40})\s+refs\/tags\/(\S+)/);

if (match && !mout.string.endsWith(match[2], '^{}')) {
tags[match[2]] = match[1];
}
});

this._cache.tags.set(source, tags);

return tags;
}.bind(this));



this._cache.tags.set(source, value);

return value;
};

GitResolver.branches = function (source) {
var value = this._cache.branches.get(source);

if (value) {
return Q.resolve(value);
}

value = this.refs(source)
.then(function (refs) {
var branches = {};




refs.forEach(function (line) {
var match = line.match(/^([a-f0-9]{40})\s+refs\/heads\/(\S+)/);

if (match) {
branches[match[2]] = match[1];
}
});

this._cache.branches.set(source, branches);

return branches;
}.bind(this));



this._cache.branches.set(source, value);

return value;
};

GitResolver.clearRuntimeCache = function () {

mout.object.forOwn(GitResolver._cache, function (lru) {
lru.reset();
});
};

GitResolver._cache = {
branches: new LRU({ max: 50, maxAge: 5 * 60 * 1000 }),
tags: new LRU({ max: 50, maxAge: 5 * 60 * 1000 }),
versions: new LRU({ max: 50, maxAge: 5 * 60 * 1000 }),
refs: new LRU({ max: 50, maxAge: 5 * 60 * 1000 })
};

module.exports = GitResolver;
