var Q = require('q');
var mout = require('mout');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('./PackageRepository');
var semver = require('../util/semver');
var copy = require('../util/copy');
var createError = require('../util/createError');

function Manager(config, logger) {
this._config = config;
this._logger = logger;
this._repository = new PackageRepository(this._config, this._logger);

this.configure({});
}



Manager.prototype.configure = function (setup) {
