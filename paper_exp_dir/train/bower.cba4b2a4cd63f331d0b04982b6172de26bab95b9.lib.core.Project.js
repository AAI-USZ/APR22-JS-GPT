var glob = require('glob');
var path = require('path');
var fs = require('../util/fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('../util/rimraf');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var md5 = require('md5-hex');
var Manager = require('./Manager');
var semver = require('../util/semver');
var createError = require('../util/createError');
var readJson = require('../util/readJson');
var validLink = require('../util/validLink');
var scripts = require('./scripts');
var relativeToBaseDir = require('../util/relativeToBaseDir');

function Project(config, logger) {
this._config = config;
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);

this._options = {};
}



Project.prototype.install = function (decEndpoints, options, config) {
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._options = options || {};
this._config = config || {};
this._working = true;


return this._analyse()
.spread(function (json, tree) {


if (!that._jsonFile && decEndpoints.length === 0 ) {
throw createError('No bower.json present', 'ENOENT');
}


that.walkTree(tree, function (node, name) {
if (node.incompatible) {
incompatibles.push(node);
} else if (node.missing || node.different || that._config.force) {
targets.push(node);
} else {
resolved[name] = node;
}
}, true);


decEndpoints = decEndpoints || [];
decEndpoints.forEach(function (decEndpoint) {




decEndpoint.newly = true;
targets.push(decEndpoint);
});


return that._bootstrap(targets, resolved, incompatibles);
})
.then(function () {
return that._manager.preinstall(that._json);
})
.then(function () {
return that._manager.install(that._json);
})
.then(function (installed) {

if (that._options.save || that._options.saveDev || that._options.saveExact || that._config.save || that._config.saveExact) {

decEndpoints.forEach(function (decEndpoint) {
var jsonEndpoint;

jsonEndpoint = endpointParser.decomposed2json(decEndpoint);

if (that._options.saveExact || that._config.saveExact) {
if (decEndpoint.name !== decEndpoint.source) {
jsonEndpoint[decEndpoint.name] = decEndpoint.source + '#' + decEndpoint.pkgMeta.version;
} else {
jsonEndpoint[decEndpoint.name] = decEndpoint.pkgMeta.version;
}
}

if (that._options.saveDev) {
that._json.devDependencies = mout.object.mixIn(that._json.devDependencies || {}, jsonEndpoint);
} else {
that._json.dependencies = mout.object.mixIn(that._json.dependencies || {}, jsonEndpoint);
}
});
}


return that.saveJson()
.then(function () {
return that._manager.postinstall(that._json).then(function () {
return installed;
});
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


if (node.linked) {
targets.push.apply(targets, mout.object.values(node.dependencies));
} else {
targets.push(node);
}

return false;
}, true);

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


if (node.linked) {
targets.push.apply(targets, mout.object.values(node.dependencies));
} else {
targets.push(node);
}

return false;
}
}, true);


that.walkTree(tree, function (node, name) {
if (node.missing || node.different) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}
}, true);
}


return that._bootstrap(targets, resolved, incompatibles)
.then(function () {
return that._manager.preinstall(that._json);
})
.then(function () {
return that._manager.install(that._json);
})
.then(function (installed) {

return that.saveJson()
.then(function () {
return that._manager.postinstall(that._json).then(function () {
return installed;
});
});
});
})
.fin(function () {
that._installed = null;
that._working = false;
});
};

function resolveUrlNames(names, flattened)
{
for (var i = 0; i < names.length; i++)
if (! flattened[names[i]])
{
var url = names[i].trim().replace(/\/$/, '');
var packName;
for (packName in flattened)
if (! ( !flattened[packName].source))
if (url == flattened[packName].source.trim().replace(/\/$/, ''))
