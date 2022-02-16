var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var bowerJson = require('bower-json');
var Manager = require('./Manager');
var Logger = require('./Logger');
var defaultConfig = require('../config');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

function Project(config, logger) {




this._config = config || defaultConfig;
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);
}



Project.prototype.install = function (endpoints, options) {
var that = this;
var targets = [];
var resolved = {};


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;

if (options.saveResolutions == null) {
this._saveResolutions = !!(options.save || options.saveDev);
} else {
this._saveResolutions = !!options.saveResolutions;
}


return this.analyse()
.spread(function (json, tree, flattened) {

that._walkTree(tree, function (node, name) {
if (node.missing) {
targets.push(node);
} else if (!node.incompatible) {
resolved[name] = node;
}
}, true);


if (endpoints) {
endpoints.forEach(function (endpoint) {
var decEndpoint = endpointParser.decompose(endpoint);


decEndpoint.unresolvable = true;
targets.push(decEndpoint);
});
}


if (targets.length) {
that._walkTree(tree, function (node) {
if (node.incompatible) {
targets.push(node);
}
}, true);
}


return that._bootstrap(targets, resolved, flattened);
})
.then(function (installed) {

if (options.save || options.saveDev) {


mout.object.forOwn(targets, function (decEndpoint) {
var source = decEndpoint.registry ? '' : decEndpoint.source;
var target = decEndpoint.target;
var endpoint = mout.string.ltrim(source + '#' + target, ['#']);

if (options.save) {
that._json.dependencies = that._json.dependencies || {};
that._json.dependencies[decEndpoint.name] = endpoint;
}

if (options.saveDev) {
that._json.devDependencies = that._json.devDependencies || {};
that._json.devDependencies[decEndpoint.name] = endpoint;
}
});
}



return that._saveJson()
.then(function () {
return installed;
});
})
.fin(function () {
that._working = false;
});
};

Project.prototype.update = function (names, options) {
var that = this;
var targets = [];
var resolved = {};


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;
this._saveResolutions = !!options.saveResolutions;


return this.analyse()
.spread(function (json, tree, flattened) {

if (!names) {

mout.object.forOwn(json.dependencies, function (value, key) {
var decEndpoint = endpointParser.json2decomposed(key, value);
decEndpoint.dependants = {};
decEndpoint.dependants[tree.name] = tree;
targets.push(decEndpoint);
});


mout.object.forOwn(flattened, function (decEndpoint) {
if (decEndpoint.extraneous) {
targets.push(decEndpoint);
}
});

} else {


that._walkTree(tree, function (node, name) {
if (node.missing || node.incompatible) {
targets.push(node);
} else if (names.indexOf(name) !== -1) {
targets.push(node);
} else {
resolved[name] = node;
}
}, true);


mout.object.forOwn(flattened, function (decEndpoint) {
var foundTarget;
var name = decEndpoint.name;

if (decEndpoint.extraneous && names.indexOf(name) !== -1) {
foundTarget = !!mout.array.find(targets, function (target) {
return target.name === name;
});

if (!foundTarget) {
targets.push(decEndpoint);
}
}
});


names.forEach(function (name) {
var foundTarget;

foundTarget = !!mout.array.find(targets, function (target) {
return target.name === name;
});

if (!foundTarget) {
throw createError('Package ' + name + ' is not installed', 'ENOTINS', {
name: name
});
}
});
}


return that._bootstrap(targets, resolved, flattened)

.then(that._saveJson.bind(that));
})
.fin(function () {
that._working = false;
});
};

Project.prototype.uninstall = function (names, options) {
var that = this;
var packages = {};


return this.analyse()

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
packages[name] = decEndpoint.canonicalPkg;
return;
}



message = dependants.map(function (dep) { return dep.name; }).join(', ') + ' depends on ' + decEndpoint.name;
data = {
name: decEndpoint.name,
dependants: dependants.map(function (decEndpoint) {
return decEndpoint.name;
})
};


if (!that._config.interactive) {
throw createError(message, 'ECONFLICT', {
data: data
});
}

that._logger.conflict('mutual', message, data);


return Q.nfcall(promptly.confirm, 'Continue anyway? (y/n)')
.then(function (confirmed) {


if (!confirmed) {
mout.array.remove(names, name);
} else {
packages[name] = decEndpoint.canonicalPkg;
}
});
});
});

return promise;
})

.then(function () {
return that._removePackages(packages, options);
});
};

Project.prototype.analyse = function () {
return Q.all([
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
pkgMeta: json,
canonicalPkg: this._config.cwd,
root: true
};



this._restoreNode(root, flattened, 'dependencies');

if (!this._production) {
this._restoreNode(root, flattened, 'devDependencies');
}


mout.object.forOwn(flattened, function (decEndpoint) {
var release;

if (!decEndpoint.dependants) {
decEndpoint.extraneous = true;


this._restoreNode(decEndpoint, flattened, 'dependencies');

if (!this._production) {
this._restoreNode(decEndpoint, flattened, 'devDependencies');
}

release = decEndpoint.pkgMeta._release;
this._logger.log('warn', 'extraneous', decEndpoint.name + (release ? '#' + release : ''), {
pkgMeta: decEndpoint.pkgMeta,
canonicalPkg: decEndpoint.canonicalPkg
});
}
}, this);


delete flattened[json.name];

return [json, root, flattened];
}.bind(this));
};



Project.prototype._bootstrap = function (targets, resolved, flattened) {
var installed = mout.object.map(flattened, function (decEndpoint) {
return decEndpoint.pkgMeta;
});


return this._manager
.setProduction(this._production)
.setResolutions(this._json.resolutions, this._saveResolutions)
.configure(targets, resolved, installed)
.resolve()

.then(function () {
var resolutions = this._manager.getResolutions();


if (!mout.object.size(resolutions)) {
delete this._json.resolutions;
} else {
this._json.resolutions = resolutions;
}
}.bind(this))

.then(this._manager.install.bind(this._manager));
};

Project.prototype._readJson = function () {
var that = this;

if (this._json) {
return Q.resolve(this._json);
}


return this._json = Q.nfcall(bowerJson.find, this._config.cwd)
.then(function (filename) {

if (path.basename(filename) === 'component.json') {
process.nextTick(function () {
that._logger.warn('deprecated', 'You are using the deprecated component.json file', {
json: filename
});
});
}

that._jsonFile = filename;


return Q.nfcall(bowerJson.read, filename)
.fail(function (err) {
throw createError('Something went wrong while reading ' + filename, err.code, {
details: err.message,
data: {
filename: filename
}
});
});
}, function () {

