var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('rimraf');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var semver = require('../util/semver');
var md5 = require('../util/md5');
var createError = require('../util/createError');
var readJson = require('../util/readJson');
var validLink = require('../util/validLink');
var scripts = require('./scripts');

function Project(config, logger) {




this._config = config || defaultConfig;
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

that.walkTree(tree, function (node, name) {
if (node.incompatible) {
incompatibles.push(node);
