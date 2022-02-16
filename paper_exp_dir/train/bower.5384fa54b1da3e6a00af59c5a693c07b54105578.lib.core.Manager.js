var Q = require('q');
var mout = require('mout');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('../util/rimraf');
var fs = require('../util/fs');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('./PackageRepository');
var semver = require('../util/semver');
var copy = require('../util/copy');
var createError = require('../util/createError');
var scripts = require('./scripts');
var relativeToBaseDir = require('../util/relativeToBaseDir');

function Manager(config, logger) {
this._config = config;
this._logger = logger;
this._repository = new PackageRepository(this._config, this._logger);

this.configure({});
}



