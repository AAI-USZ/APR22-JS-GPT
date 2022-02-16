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
this._endpoints = decEndpoints.map(function (endpoint) {
return endpoint.name || endpoint.source;
});


return this._analyse()
.spread(function (json, tree) {


if(!that._jsonFile && decEndpoints.length === 0 ) {
throw createError('No bower.json present', 'ENOENT');
