var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var md5 = require('../util/md5');
var createError = require('../util/createError');
var readJson = require('../util/readJson');
var validLink = require('../util/validLink');

function Project(config, logger) {




this._config = config || defaultConfig;
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);

this._options = {};
}



Project.prototype.install = function (endpoints, options) {
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._options = options || {};
