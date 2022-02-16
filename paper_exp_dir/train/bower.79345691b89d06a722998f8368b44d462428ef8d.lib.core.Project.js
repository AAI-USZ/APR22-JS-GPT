var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var bowerJson = require('bower-json');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var md5 = require('../util/md5');
var createError = require('../util/createError');

function Project(config, logger) {




this._config = config || defaultConfig;
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);

this._options = {};
}



Project.prototype.install = function (endpoints, options) {
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._options = options || {};
this._working = true;


return this._analyse()
.spread(function (json, tree) {

that.walkTree(tree, function (node, name) {
if (node.missing || node.linked) {
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




decEndpoint.newly = true;
});
}


return that._bootstrap(targets, resolved, incompatibles);
})
.then(function (installed) {

if (that._options.save || that._options.saveDev) {
mout.object.forOwn(targets, function (decEndpoint) {
var jsonEndpoint = endpointParser.decomposed2json(decEndpoint);

if (that._options.save) {
that._json.dependencies = mout.object.mixIn(that._json.dependencies || {}, jsonEndpoint);
}

if (that._options.saveDev) {
that._json.devDependencies = mout.object.mixIn(that._json.devDependencies || {}, jsonEndpoint);
}
});
}


return that.saveJson()
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

this._options = options || {};
this._working = true;


return this._analyse()
.spread(function (json, tree, flattened) {

if (!names) {

that.walkTree(tree, function (node) {
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


that.walkTree(tree, function (node, name) {
if (names.indexOf(name) !== -1) {
targets.push(node);
return false;
}
}, true);


mout.object.forOwn(flattened, function (decEndpoint, name) {
if (decEndpoint.extraneous && names.indexOf(name) !== -1) {
targets.push(decEndpoint);
}
});



that.walkTree(tree, function (node, name) {
if (node.missing || node.linked) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}
}, true);
}


return that._bootstrap(targets, resolved, incompatibles)
.then(function (installed) {

return that.saveJson()
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

options = options || {};
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
var message;
var data;
var dependantsNames;
var dependants = [];


that.walkTree(tree, function (node, nodeName) {
if (name === nodeName) {
dependants.push.apply(dependants, mout.object.values(node.dependants));
}
}, true);


dependants = mout.array.unique(dependants);



dependants = dependants.filter(function (dependant) {
return !dependant.root && names.indexOf(dependant.name) === -1;
});



if (!dependants.length || that._config.force) {
packages[name] = decEndpoint.canonicalDir;
return;
}




dependantsNames = dependants
.map(function (dep) {
return dep.name;
})
.sort(function (name1, name2) {
return name1.localeCompare(name2);
});

dependantsNames = mout.array.unique(dependantsNames);
message = dependantsNames.join(', ') + ' depends on ' + decEndpoint.name;
data = {
name: decEndpoint.name,
dependants: dependants
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
return that._removePackages(packages);
})
.fin(function () {
that._installed = null;
that._working = false;
});
};

Project.prototype.hasJson = function () {
return this._readJson(false)
.then(function (json) {
return json ? this._jsonFile : false;
}.bind(this));
};

Project.prototype.getJson = function (assume) {
assume = arguments.length ? !!assume : true;

