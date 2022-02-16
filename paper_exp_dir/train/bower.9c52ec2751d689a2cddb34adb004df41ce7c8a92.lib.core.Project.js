var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('rimraf');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var md5 = require('md5-hex');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var semver = require('../util/semver');
var createError = require('../util/createError');
var readJson = require('../util/readJson');
var validLink = require('../util/validLink');
var scripts = require('./scripts');

function Project(config, logger) {




this._config = defaultConfig(config);
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);

this._options = {};
}

