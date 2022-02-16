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
var isPathAbsolute = require('../util/isPathAbsolute');

function Project(config, logger) {
this._config = config;
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);

this._options = {};
}



