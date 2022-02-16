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
var Manager = require('./Manager');
var Logger = require('./Logger');
var defaultConfig = require('../config');
var md5 = require('../util/md5');
var createError = require('../util/createError');

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


