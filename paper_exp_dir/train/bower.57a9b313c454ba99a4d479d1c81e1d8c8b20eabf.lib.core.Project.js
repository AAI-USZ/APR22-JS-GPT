var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var bowerJson = require('bower-json');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');
var F = require('../util/flow');

function Project(config) {
this._config = config || defaultConfig;
this._manager = new Manager(this._config);
}



Project.prototype.install = function (endpoints, options) {
var that = this;
var targets = {};
var resolved = {};
var installed;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;



if (!endpoints) {
return this._repair(true)
.fin(function () {
that._working = false;
});
}


return this._repair()

.then(that.analyse.bind(this))
.spread(function (json, tree, flattened) {
var targets = {};
var resolved = {};
var installed;


endpoints.forEach(function (endpoint) {
var decEndpoint = endpointParser.decompose(endpoint);
targets[decEndpoint.name] = decEndpoint;
});





that._walkTree(tree, function (node, name) {
if (targets[name]) {
return false;
}
resolved[name] = node.pkgMeta;
});

installed = mout.object.map(flattened, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
})

.then(function () {
return that._bootstrap(targets, resolved, installed);
})

.then(function (installed) {
var jsonKey;

if (!options.save && !options.saveDev) {
return;
}

jsonKey = options.save ? 'dependencies' : 'devDependencies';
that._json[jsonKey] = that._json[jsonKey] || {};

mout.object.forOwn(targets, function (decEndpoint) {
var source = decEndpoint.registry ? '' : decEndpoint.source;
var target = decEndpoint.pkgMeta.version ? '~' + decEndpoint.pkgMeta.version : decEndpoint.target;
that._json[jsonKey][decEndpoint.name] = mout.string.ltrim(source + '#' + target, ['#']);
});

return that._saveJson()
.then(function () {
return installed;
}, null, function (notification) {
return notification;
});
})
.fin(function () {
that._working = false;
});
};

Project.prototype.update = function (names, options) {
var that = this;
var targets;
var resolved;
var installed;
var repaired;
var promise;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;


if (!names) {

promise = this.analyse()
.spread(function (json, tree, flattened) {

targets = mout.object.map(json.dependencies, function (value, key) {
return endpointParser.json2decomposed(key, value);
});


installed = mout.object.map(flattened, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
});

} else {


promise = this._repair(true)

.then(function (result) {
repaired = result;
return that.analyse();
})
.spread(function (json, tree, flattened) {
targets = {};
resolved = {};


names.forEach(function (name) {
var decEndpoint = flattened[name];
var jsonEntry;

if (!decEndpoint) {
throw createError('Package ' + name + ' is not installed', 'ENOTINSTALLED');
}


if (repaired[name]) {
return;
}



jsonEntry = json.dependencies && json.dependencies[name];
if (jsonEntry) {
targets[name] = endpointParser.json2decomposed(name, jsonEntry);
} else {
targets[name] = decEndpoint;
}
});



that._walkTree(tree, function (node, name) {
if (targets[name]) {
return false;
}
resolved[name] = node.pkgMeta;
});


installed = mout.object.map(flattened, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
});
}


return promise.then(function () {
return that._bootstrap(targets, resolved, installed);
})
.fin(function () {
that._working = false;
});
};

Project.prototype.uninstall = function (names, options) {
var that = this;
var deferred = Q.defer();
var packages = {};


this.analyse()

.spread(function (json, tree, flattened) {
var promise = Q.resolve();

names.forEach(function (name) {
var decEndpoint = flattened[name];


if (!decEndpoint || decEndpoint.missing) {
packages[name] = null;
return;
}

promise = promise
.then(function () {
var dependants;
var message;
var data;




dependants = [];
mout.object.forOwn(decEndpoint.dependants, function (decEndpoint) {
if (!decEndpoint.root && names.indexOf(decEndpoint.name) === -1) {
dependants.push(decEndpoint);
}
});



if (!dependants.length || that._config.force) {
packages[name] = decEndpoint.dir;


} else {
message = dependants.map(function (dep) { return dep.name; }).join(', ') + ' depends on ' + decEndpoint.name;
data = {
package: decEndpoint.name,
dependants: dependants.map(function (decEndpoint) {
return decEndpoint.name;
})
};


if (!that._config.interactive) {
throw createError(message, 'ECONFLICT', {
skippable: true,
data: data
});

} else {
deferred.notify({
level: 'conflict',
id: 'mutual',
message: message,
data: data
});

return Q.nfcall(promptly.confirm, 'Continue anyway? (y/n)')
.then(function (confirmed) {


if (!confirmed) {
mout.array.remove(names, name);
} else {
packages[name] = decEndpoint.dir;
}
});
}
}
});
});

return promise;
})

.then(function () {
return that._removePackages(packages, options)
.progress(function (notification) {
return notification;
});
})
.then(deferred.resolve, deferred.reject, deferred.notify);

return deferred.promise;
};

Project.prototype.analyse = function () {
return F.all([
this._readJson(),
this._readInstalled()
])
.spread(function (json, installed) {
var root;
var flattened = installed;

root = {
name: json.name,
source: this._config.cwd,
target: json.version,
dir: this._config.cwd,
pkgMeta: json,
root: true
};



this._restoreNode(root, flattened);

if (!this._production) {
this._restoreNode(root, flattened, 'devDependencies');
}


mout.object.forOwn(flattened, function (decEndpoint) {
if (!decEndpoint.dependants) {
decEndpoint.extraneous = true;


this._restoreNode(decEndpoint, flattened);

if (!this._production) {
this._restoreNode(decEndpoint, flattened, 'devDependencies');
}
}
}, this);

return [json, root, flattened];
}.bind(this));
};



Project.prototype._bootstrap = function (targets, resolved, installed) {

return this._manager
.configure(mout.object.values(targets), resolved, installed)
.resolve()

.then(function () {
return this._manager.install();
}.bind(this));
};

Project.prototype._repair = function (incompatible) {
var that = this;

return this.analyse()
.spread(function (json, tree, flattened) {
var targets = [];
var resolved = {};
var isBroken = false;



mout.object.forOwn(flattened, function (decEndpoint, name) {
if (decEndpoint.missing) {
targets.push(decEndpoint);
isBroken = true;
} else if (incompatible && decEndpoint.incompatible) {
targets.push(decEndpoint);
isBroken = true;
} else if (!decEndpoint.extraneous) {
resolved[name] = decEndpoint.pkgMeta;
}
});


if (!isBroken) {
return {};
}


return that._bootstrap(targets, resolved);
});
};

Project.prototype._readJson = function () {
var that = this;
var deferred;

if (this._json) {
return Q.resolve(this._json);
}

deferred = Q.defer();


this._json = Q.nfcall(bowerJson.find, this._config.cwd)
.then(function (filename) {

if (path.basename(filename) === 'component.json') {
process.nextTick(function () {
deferred.notify({
level: 'warn',
id: 'deprecated',
message: 'You are using the deprecated component.json file',
data: {
json: filename
}
});
});
}

that._jsonFile = filename;


return Q.nfcall(bowerJson.read, filename)
.fail(function (err) {
throw createError('Something went wrong while reading "' + filename + '"', err.code, {
details: err.message
});
});
}, function () {

return Q.nfcall(bowerJson.parse, {
name: path.basename(that._config.cwd)
});
})
.then(function (json) {
that._json = json;
deferred.resolve(json);
}, deferred.reject, deferred.notify);

return deferred.promise;
};

Project.prototype._saveJson = function () {
var deferred = Q.defer();

if (!this._jsonFile) {
process.nextTick(function () {
deferred.notify({
level: 'warn',
id: 'no-json',
message: 'No bower.json file to save to'
});
deferred.resolve();
});
} else {
Q.nfcall(fs.writeFile, this._jsonFile, JSON.stringify(this._json, null, '  '))
.then(deferred.resolve, deferred.reject, deferred.notify);
}

return deferred.promise;
};

Project.prototype._readInstalled = function () {
var componentsDir = path.join(this._config.cwd, this._config.directory);



return Q.nfcall(glob, '*/.bower.json', {
cwd: componentsDir,
dot: true
})
.then(function (filenames) {
var promises = [];
var decEndpoints = {};


filenames.forEach(function (filename) {
var promise;
var name = path.dirname(filename);
var jsonFile = path.join(componentsDir, filename);


promise = Q.nfcall(fs.readFile, jsonFile)
.then(function (contents) {
var pkgMeta = JSON.parse(contents.toString());

decEndpoints[name] = {
name: name,
source: pkgMeta._source,
target: pkgMeta.version,
dir: path.dirname(jsonFile),
pkgMeta: pkgMeta
};
});

promises.push(promise);
});



return Q.all(promises)
.then(function () {
return decEndpoints;
});
});
};

Project.prototype._removePackages = function (packages, options) {
var promises = [];
var jsonKey = options.save ? 'dependencies' : (options.saveDev ? 'devDependencies' : null);
var deferred = Q.defer();

mout.object.forOwn(packages, function (dir, name) {
var promise;


if (!dir) {
process.nextTick(function () {
deferred.notify({
level: 'info',
id: 'absent',
message: name,
data: {
package: name
}
});
});
promise = Q.resolve();
} else {
process.nextTick(function () {
deferred.notify({
level: 'action',
id: 'uninstall',
message: name,
data: {
package: name,
dir: dir
}
});
});
promise = Q.nfcall(rimraf, dir);
}


if (jsonKey && this._json[jsonKey]) {
promise = promise
.then(function () {
delete this._json[jsonKey][name];
}.bind(this));
}

promises.push(promise);
}, this);

Q.all(promises)

.then(this._saveJson.bind(this))

.then(function () {
return packages;
})
.then(deferred.resolve, deferred.reject, deferred.notify);

return deferred.promise;
};

Project.prototype._walkTree = function (node, fn) {
var queue = [node];
var result;

while (queue.length) {
node = queue.shift();
result = fn(node, node.name);

if (result === false) {
continue;
}

queue.unshift.apply(queue, mout.object.values(node.dependencies));
}
};

Project.prototype._restoreNode = function (node, flattened, jsonKey) {


if (node.dependencies || node.missing || node.incompatible) {
return;
}

node.dependencies = {};
node.dependants = {};

mout.object.forOwn(node.pkgMeta[jsonKey || 'dependencies'], function (value, key) {
var local = flattened[key];
var json = endpointParser.json2decomposed(key, value);


if (!local) {
flattened[key] = local = json;
local.missing = true;

} else if (!local.incompatible && !local.missing && !this._manager.areCompatible(local.pkgMeta.version || '*', json.target)) {
json.pkgMeta = local.pkgMeta;
flattened[key] = local = json;
local = json;
local.incompatible = true;
}


node.dependencies[key] = local;
local.dependants = local.dependants || {};
local.dependants[node.name] = node;


this._restoreNode(local, flattened);
}, this);
};

module.exports = Project;
