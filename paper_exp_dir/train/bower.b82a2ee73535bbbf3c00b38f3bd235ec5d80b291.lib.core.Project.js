var glob = require('glob');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
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
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;
this._working = true;


return this._analyse()
.spread(function (json, tree) {

that._walkTree(tree, function (node, name) {
if (node.missing) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}
}, true);


if (endpoints) {
endpoints.forEach(function (endpoint) {
var decEndpoint = endpointParser.decompose(endpoint);
targets.push(decEndpoint);


decEndpoint.unresolvable = true;
});
}


return that._bootstrap(targets, resolved, incompatibles);
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
that._installed = null;
that._working = false;
});
};

Project.prototype.update = function (names, options) {
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;
this._working = true;


return this._analyse()
.spread(function (json, tree, flattened) {

if (!names) {

that._walkTree(tree, function (node) {
targets.push(node);
return false;
}, true);


mout.object.forOwn(flattened, function (decEndpoint) {
if (decEndpoint.extraneous) {
targets.push(decEndpoint);
}
});

} else {


names.forEach(function (name) {
if (!flattened[name]) {
throw createError('Package ' + name + ' is not installed', 'ENOTINS', {
name: name
});
}
});



that._walkTree(tree, function (node, name) {
if (node.missing) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}
}, true);


that._walkTree(tree, function (node, name) {
if (!node.missing && names.indexOf(name) !== -1) {
targets.push(node);
}
}, true);


mout.object.forOwn(flattened, function (decEndpoint, name) {
if (decEndpoint.extraneous && names.indexOf(name) !== -1) {
targets.push(decEndpoint);
}
});
}


return that._bootstrap(targets, resolved, incompatibles)
.then(function (installed) {

return that._saveJson()
.then(function () {
return installed;
});
});
})
.fin(function () {
that._installed = null;
that._working = false;
});
};

Project.prototype.uninstall = function (names, options) {
var that = this;
var packages = {};


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._working = true;


return this._analyse()

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
packages[name] = decEndpoint.canonicalDir;
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
packages[name] = decEndpoint.canonicalDir;
}
});
});
});

return promise;
})

.then(function () {
return that._removePackages(packages, options);
})
.fin(function () {
that._installed = null;
that._working = false;
});
};

Project.prototype.getTree = function () {
return this._analyse()
.spread(function (json, tree, flattened) {
var extraneous = [];

tree = this._manager.toData(tree, ['missing', 'incompatible']);
tree.root = true;

mout.object.forOwn(flattened, function (pkg) {
if (pkg.extraneous) {
extraneous.push(this._manager.toData(pkg));
}
}, this);

return [tree, flattened, extraneous];
}.bind(this));
};



Project.prototype._analyse = function () {
return Q.all([
this._readJson(),
this._readInstalled()
])
.spread(function (json, installed) {
var root;
var flattened = mout.object.mixIn({}, installed);

root = {
name: json.name,
source: this._config.cwd,
target: json.version || '*',
pkgMeta: json,
canonicalDir: this._config.cwd,
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


if (this._jsonFile) {
release = decEndpoint.pkgMeta._release;
this._logger.log('warn', 'extraneous', decEndpoint.name + (release ? '#' + release : ''), this._manager.toData(decEndpoint));
}
}
}, this);


delete flattened[json.name];

return [json, root, flattened];
}.bind(this));
};

Project.prototype._bootstrap = function (targets, resolved, incompatibles) {
var installed = mout.object.map(this._installed, function (decEndpoint) {
return decEndpoint.pkgMeta;
});

this._json.resolutions = this._json.resolutions || {};


return this._manager
.configure({
targets: targets,
resolved: resolved,
incompatibles: incompatibles,
resolutions: this._json.resolutions,
installed: installed
})
.resolve()
.then(function () {

if (!mout.object.size(this._json.resolutions)) {
