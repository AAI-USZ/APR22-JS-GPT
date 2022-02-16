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


return this.analyse()
.spread(function (json, tree, flattened) {


that._walkTree(tree, function (node, name) {
if (node.walked) {
return;
}

if (node.missing || node.incompatible) {
targets.push(node);
} else {
resolved[name] = node;
}

node.walked = true;
});


if (endpoints) {
endpoints.forEach(function (endpoint) {
targets.push(endpointParser.decompose(endpoint));
});
}


return that._bootstrap(targets, resolved, flattened);
})

.then(function (installed) {
if (!options.save && !options.saveDev) {
return installed;
}



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
if (node.walked) {
return;
}

if (node.missing || node.incompatible) {
targets.push(node);
} else if (names.indexOf(name) !== -1) {
targets.push(node);
} else {
resolved[name] = node;
}

node.walked = true;
});


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
