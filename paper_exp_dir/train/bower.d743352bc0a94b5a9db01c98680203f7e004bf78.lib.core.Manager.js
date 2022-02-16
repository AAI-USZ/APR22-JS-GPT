var Q = require('q');
var mout = require('mout');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('./PackageRepository');
var semver = require('../util/semver');
var copy = require('../util/copy');
var createError = require('../util/createError');
var scripts = require('./scripts');

function Manager(config, logger) {
this._config = config;
this._logger = logger;
this._repository = new PackageRepository(this._config, this._logger);

this.configure({});
}



Manager.prototype.configure = function (setup) {
var targetsHash = {};

this._conflicted = {};


this._targets = setup.targets || [];
this._targets.forEach(function (decEndpoint) {
decEndpoint.initialName = decEndpoint.name;
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
targetsHash[decEndpoint.name] = true;


decEndpoint.unresolvable = !!decEndpoint.newly;
});


this._resolved = {};
this._installed = {};
mout.object.forOwn(setup.resolved, function (decEndpoint, name) {
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
this._resolved[name] = [decEndpoint];
this._installed[name] = decEndpoint.pkgMeta;
}, this);


mout.object.mixIn(this._installed, setup.installed);


this._incompatibles = {};
setup.incompatibles = this._uniquify(setup.incompatibles || []);
setup.incompatibles.forEach(function (decEndpoint) {
var name = decEndpoint.name;

this._incompatibles[name] = this._incompatibles[name] || [];
this._incompatibles[name].push(decEndpoint);
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);


this._conflicted[name] = true;


if (!targetsHash[name] && !this._resolved[name]) {
this._targets.push(decEndpoint);
}
}, this);


this._resolutions = setup.resolutions || {};


this._targets = this._uniquify(this._targets);


this._forceLatest = !!setup.forceLatest;

return this;
};

Manager.prototype.resolve = function () {

if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}


this._fetching = {};
this._nrFetching = 0;
this._failed = {};
this._hasFailed = false;
this._deferred = Q.defer();


if (!this._targets.length) {
process.nextTick(this._dissect.bind(this));


} else {
this._targets.forEach(this._fetch.bind(this));
}


return this._deferred.promise
.fin(function () {
this._working = false;
}.bind(this));
};

Manager.prototype.preinstall = function (json) {
var that = this;
var componentsDir = path.join(this._config.cwd, this._config.directory);


if (mout.lang.isEmpty(that._dissected)) {
return Q.resolve({});
}

return Q.nfcall(mkdirp, componentsDir)
.then(function () {
return scripts.preinstall(
that._config, that._logger, that._dissected, that._installed, json
);
});
};

Manager.prototype.postinstall = function (json) {
var that = this;
var componentsDir = path.join(this._config.cwd, this._config.directory);


if (mout.lang.isEmpty(that._dissected)) {
return Q.resolve({});
}

return Q.nfcall(mkdirp, componentsDir)
.then(function () {
return scripts.postinstall(
that._config, that._logger, that._dissected, that._installed, json
);
});
};

Manager.prototype.install = function (json) {
var componentsDir;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}


if (mout.lang.isEmpty(that._dissected)) {
return Q.resolve({});
}

componentsDir = path.join(this._config.cwd, this._config.directory);
return Q.nfcall(mkdirp, componentsDir)
.then(function () {
var promises = [];

mout.object.forOwn(that._dissected, function (decEndpoint, name) {
var promise;
var dst;
var release = decEndpoint.pkgMeta._release;

that._logger.action('install', name + (release ? '#' + release : ''), that.toData(decEndpoint));

dst = path.join(componentsDir, name);


promise = Q.nfcall(rimraf, dst)
.then(copy.copyDir.bind(copy, decEndpoint.canonicalDir, dst))
.then(function () {
var metaFile = path.join(dst, '.bower.json');

decEndpoint.canonicalDir = dst;


return Q.nfcall(fs.readFile, metaFile)
.then(function (contents) {
var json = JSON.parse(contents.toString());

json._target = decEndpoint.target;
json._originalSource = decEndpoint.source;
if (decEndpoint.newly) {
json._direct = true;
}

json = JSON.stringify(json, null, '  ');
return Q.nfcall(fs.writeFile, metaFile, json);
});
});

promises.push(promise);
});

return Q.all(promises);
})
.then(function () {


mout.object.forOwn(that._dissected, function (pkg) {

mout.object.forOwn(pkg.dependencies, function (dependency, name) {
var dissected = this._dissected[name] || (this._resolved[name] ? this._resolved[name][0] : dependency);
pkg.dependencies[name] = dissected;
}, this);


pkg.dependants = pkg.dependants.map(function (dependant) {
var name = dependant.name;
var dissected = this._dissected[name] || (this._resolved[name] ? this._resolved[name][0] : dependant);

return dissected;
}, this);
}, that);


return mout.object.map(that._dissected, function (decEndpoint) {
return this.toData(decEndpoint);
}, that);
})
.fin(function () {
this._working = false;
}.bind(this));
};

Manager.prototype.toData = function (decEndpoint, extraKeys, upperDeps) {
var names;
var extra;

var data = {};

upperDeps = upperDeps || [];
data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);

if (decEndpoint.canonicalDir) {
data.canonicalDir = decEndpoint.canonicalDir;
data.pkgMeta = decEndpoint.pkgMeta;
}

if (extraKeys) {
extra = mout.object.pick(decEndpoint, extraKeys);
extra = mout.object.filter(extra, function (value) {
return !!value;
});
mout.object.mixIn(data, extra);
}

if (decEndpoint.dependencies) {
data.dependencies = {};



names = Object.keys(decEndpoint.dependencies).sort();
names.forEach(function (name) {



if (!mout.array.contains(upperDeps, name)) {
data.dependencies[name] = this.toData(decEndpoint.dependencies[name],
extraKeys,
upperDeps.concat(decEndpoint.name));
}
}, this);
}

data.nrDependants = mout.object.size(decEndpoint.dependants);

return data;
};

Manager.prototype.getPackageRepository = function () {
return this._repository;
};



Manager.prototype._fetch = function (decEndpoint) {
var name = decEndpoint.name;


if (this._hasFailed) {
return;
}


this._fetching[name] = this._fetching[name] || [];
this._fetching[name].push(decEndpoint);
this._nrFetching++;




return decEndpoint.promise = this._repository.fetch(decEndpoint)

.spread(this._onFetchSuccess.bind(this, decEndpoint))

.fail(this._onFetchError.bind(this, decEndpoint));
};

Manager.prototype._onFetchSuccess = function (decEndpoint, canonicalDir, pkgMeta, isTargetable) {
var name;
var resolved;
var index;
var incompatibles;
var initialName = decEndpoint.initialName != null ? decEndpoint.initialName : decEndpoint.name;
var fetching = this._fetching[initialName];


mout.array.remove(fetching, decEndpoint);
this._nrFetching--;


decEndpoint.name = name = decEndpoint.name || pkgMeta.name;
decEndpoint.canonicalDir = canonicalDir;
decEndpoint.pkgMeta = pkgMeta;
delete decEndpoint.promise;




resolved = this._resolved[name] = this._resolved[name] || [];
index = mout.array.findIndex(resolved, function (resolved) {
return resolved.target === decEndpoint.target;
});
if (index !== -1) {

decEndpoint.dependants.push.apply(decEndpoint.dependants, resolved[index.dependants]);
decEndpoint.dependants = this._uniquify(decEndpoint.dependants);
resolved.splice(index, 1);
}
resolved.push(decEndpoint);


this._parseDependencies(decEndpoint, pkgMeta, 'dependencies');



incompatibles = this._incompatibles[name];
if (incompatibles) {

incompatibles = incompatibles.filter(function (incompatible) {
return !resolved.some(function (decEndpoint) {
return incompatible.target === decEndpoint.target;
});
}, this);

incompatibles = incompatibles.filter(function (incompatible) {
return !fetching.some(function (decEndpoint) {
return incompatible.target === decEndpoint.target;
});
}, this);

incompatibles.forEach(this._fetch.bind(this));
delete this._incompatibles[name];
}




if (!isTargetable) {
decEndpoint.untargetable = true;
}



if (this._nrFetching <= 0) {
process.nextTick(this._dissect.bind(this));
}
};

Manager.prototype._onFetchError = function (decEndpoint, err) {
var name = decEndpoint.name;

err.data = err.data || {};
err.data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);


mout.array.remove(this._fetching[name], decEndpoint);
this._nrFetching--;


this._failed[name] = this._failed[name] || [];
this._failed[name].push(err);
delete decEndpoint.promise;


this._failFast();



if (this._nrFetching <= 0) {
process.nextTick(this._dissect.bind(this));
}
};

Manager.prototype._failFast = function () {
if (this._hasFailed) {
return;
}

this._hasFailed = true;



this._failFastTimeout = setTimeout(function () {
this._nrFetching = Infinity;
this._dissect();
}.bind(this), 20000);
};

Manager.prototype._parseDependencies = function (decEndpoint, pkgMeta, jsonKey) {
var pending = [];

decEndpoint.dependencies = decEndpoint.dependencies || {};


mout.object.forOwn(pkgMeta[jsonKey], function (value, key) {
var resolved;
var fetching;
var compatible;
var childDecEndpoint = endpointParser.json2decomposed(key, value);



resolved = this._resolved[key];
if (resolved) {

compatible = mout.array.find(resolved, function (resolved) {
return childDecEndpoint.target === resolved.target;
}, this);


if (compatible) {
decEndpoint.dependencies[key] = compatible;
compatible.dependants.push(decEndpoint);
compatible.dependants = this._uniquify(compatible.dependants);

return;
}


compatible = mout.array.find(resolved, function (resolved) {
return this._areCompatible(childDecEndpoint, resolved);
}, this);



if (compatible) {
decEndpoint.dependencies[key] = compatible;
childDecEndpoint.canonicalDir = compatible.canonicalDir;
childDecEndpoint.pkgMeta = compatible.pkgMeta;
childDecEndpoint.dependencies = compatible.dependencies;
childDecEndpoint.dependants = [decEndpoint];
this._resolved[key].push(childDecEndpoint);

return;
}
}



fetching = this._fetching[key];
if (fetching) {
compatible = mout.array.find(fetching, function (fetching) {
return this._areCompatible(childDecEndpoint, fetching);
}, this);

if (compatible) {
pending.push(compatible.promise);
return;
}
}


childDecEndpoint.unresolvable = !!decEndpoint.unresolvable;


decEndpoint.dependencies[key] = childDecEndpoint;
childDecEndpoint.dependants = [decEndpoint];
this._fetch(childDecEndpoint);
}, this);

if (pending.length > 0) {
Q.all(pending)
.then(function () {
this._parseDependencies(decEndpoint, pkgMeta, jsonKey);
}.bind(this));
}
};

Manager.prototype._dissect = function () {
var err;
var componentsDir;
var promise = Q.resolve();
var suitables = {};
var that = this;



if (this._hasFailed) {
clearTimeout(this._failFastTimeout);

err = mout.object.values(this._failed)[0][0];
this._deferred.reject(err);
return;
}


mout.object.forOwn(this._resolved, function (decEndpoints, name) {
var semvers;
var nonSemvers;


semvers = decEndpoints.filter(function (decEndpoint) {
return !!decEndpoint.pkgMeta.version;
});


semvers.sort(function (first, second) {
var result = semver.rcompare(first.pkgMeta.version, second.pkgMeta.version);



if (!result) {
if (first.target === '*') {
return 1;
}
if (second.target === '*') {
return -1;
}
}

return result;
});




semvers.forEach(function (decEndpoint) {
if (decEndpoint.newly && decEndpoint.target === '*' && !decEndpoint.untargetable) {
decEndpoint.target = '~' + decEndpoint.pkgMeta.version;
decEndpoint.originalTarget = '*';
}
});


nonSemvers = decEndpoints.filter(function (decEndpoint) {
return !decEndpoint.pkgMeta.version;
});

promise = promise.then(function () {
return that._electSuitable(name, semvers, nonSemvers)
.then(function (suitable) {
suitables[name] = suitable;
});
});
}, this);


promise
.then(function () {

componentsDir = path.resolve(that._config.cwd, that._config.directory);
this._dissected = mout.object.filter(suitables, function (decEndpoint, name) {
var installedMeta = this._installed[name];
var dst;


if (decEndpoint.linked) {
return false;
}


dst = path.join(componentsDir, name);
