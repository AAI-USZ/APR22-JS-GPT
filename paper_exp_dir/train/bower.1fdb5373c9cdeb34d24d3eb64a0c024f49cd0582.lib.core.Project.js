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
if (node.missing || node.incompatible) {
targets.push(node);
} else {
resolved[name] = node;
}
}, true);


if (endpoints) {
endpoints.forEach(function (endpoint) {
