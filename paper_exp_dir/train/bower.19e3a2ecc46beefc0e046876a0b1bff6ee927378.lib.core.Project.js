var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var bowerJson = require('bower-json');
var semver = require('semver');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');
var copy = require('../util/copy');

var Project = function (options) {
options = options || {};

this._config = options.config || defaultConfig;
this._manager = new Manager(options);
};

Project.prototype.install = function (endpoints) {

if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}


if (endpoints && !endpoints.length) {
endpoints = null;
}



return Q.all([
this._collectLocal(),
this._collectFromJson(),
this._collectFromEndpoints(endpoints)
])
.spread(function (locals, jsons, endpoints) {
var toBeResolved = [];
var resolved = [];


