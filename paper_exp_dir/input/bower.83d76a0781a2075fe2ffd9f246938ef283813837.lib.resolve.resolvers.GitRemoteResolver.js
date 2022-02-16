var util = require('util');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var Resolver = require('./Resolver');
var cmd = require('../../util/cmd');
var createError = require('../../util/createError');

var GitRemoteResolver = function (source, options) {
Resolver.call(this, source, options);
};

util.inherits(GitRemoteResolver, Resolver);



GitRemoteResolver.prototype.hasNew = function (oldTarget, oldResolution) {
return this._resolveTarget(this._target)
.then(function (resolution) {

if (oldResolution.type !== resolution.type) {
return true;
}



if (resolution.type === 'tag') {
return semver.neq(resolution.tag, oldResolution.tag);
}




return resolution.commit !== oldResolution.commit;
});
};

GitRemoteResolver.prototype._resolveSelf = function () {
var promise;

promise = this._resolveTarget()
.then(this._checkout.bind(this));

return promise;
};

GitRemoteResolver.prototype._resolveTarget = function () {
var target = this._target,
source = this._source,
promise,
branches,
errorMessage,
errorDetails;


if (semver.valid(target) || semver.validRange(target)) {
return GitRemoteResolver._fetchVersions(this._source)
.then(function (versions) {

var version = mout.array.find(versions, function (version) {
return semver.satisfies(version, target);
});

if (!version) {
errorMessage = !semver.validRange(target) ?
'Tag "' + target + '" does not exist' :
'No tag found that was able to satisfy "' + target + '"';
errorDetails = !versions.length ?
'No tags found in "' + source + '"' :
'Available tags in "' + source + '" are: ' + versions.join(', ');
throw createError(errorMessage, 'ENORESTARGET', errorDetails);
}

return { type: 'tag', tag: version };
});
}


promise = GitRemoteResolver._fetchHeads(this._source);



if ((/^[a-f0-9]{40}$/).test(target)) {
return Q.resolve({ type: 'commit', commit: target });
}


if (target === '*') {
target = 'master';
}


return promise.then(function (heads) {
if (!heads[target]) {
branches = Object.keys(heads);
errorDetails = !branches.length ?
'No branches found in "' + source + '"' :

throw createError('Branch "' + target + '" does not exist', 'ENORESTARGET', errorDetails);
}

return { type: 'branch', branch: target, commit: heads[target] };
});
};

GitRemoteResolver.prototype._checkout = function (resolution) {
var dir = this._tempDir,
branch;

console.log(resolution);
if (resolution.type === 'commit') {
return Q.nfcall(cmd, 'git', ['clone', this._source, dir])
.then(function () {
return Q.nfcall(cmd, 'git', ['checkout', resolution.commit], { cwd: dir });
});
} else {
branch = resolution.tag || resolution.branch;
return Q.nfcall(cmd, 'git', ['clone',  this._source, '-b', branch, '--depth', 1], { cwd: dir });
}
};



GitRemoteResolver._fetchRefs = function (source) {
if (this._refs && this._refs[source]) {
return Q.resolve(this._refs[source]);
}

return Q.nfcall(cmd, 'git', ['ls-remote', '--tags', '--heads', source])
.then(function (stdout) {

var refs = stdout.toString().split('\n');

this._refs = this._refs  || {};
return this._refs[source] = refs;
}.bind(this));
};

GitRemoteResolver._fetchVersions = function (source) {
if (this._versions && this._versions[source]) {
return Q.resolve(this._versions[source]);
}

return this._fetchRefs(source)
.then(function (refs) {
var versions = [];


refs.forEach(function (line) {
var match = line.match(/^[a-f0-9]{40}\s+refs\/tags\/(\S+)$/),
cleaned;


if (match) {
cleaned = semver.clean(match[1]);
if (cleaned) {
versions.push(cleaned);
}
}
});


versions = versions.sort(function (a, b) {
return semver.gt(a, b) ? -1 : 1;
});

this._versions = this._versions  || {};
return this._versions[source] = versions;
}.bind(this));
};

GitRemoteResolver._fetchHeads = function (source) {
if (this._heads && this._heads[source]) {
return Q.resolve(this._heads[source]);
}

