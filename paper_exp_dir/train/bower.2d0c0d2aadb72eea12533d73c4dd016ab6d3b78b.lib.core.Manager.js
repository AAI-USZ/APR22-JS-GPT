var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var PackageRepository = require('./PackageRepository');
var defaultConfig = require('../config');
var copy = require('../util/copy');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

function Manager(config) {
this._config = config || defaultConfig;
this._repository = new PackageRepository(config);
}



Manager.prototype.configure = function (targets, resolved, installed) {

if (this._working) {
throw createError('Can\'t configure while working', 'EWORKING');
