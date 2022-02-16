var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var promptly = require('promptly');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('./PackageRepository');
var copy = require('../util/copy');
var createError = require('../util/createError');

function Manager(config, logger) {
this._config = config;
this._logger = logger;
this._repository = new PackageRepository(this._config, this._logger);

this.configure({});
}



Manager.prototype.configure = function (setup) {
var targetsHash = {};

this._conflicted = {};


this._targets = setup.targets || [];
this._targets.forEach(function (decEndpoint) {
decEndpoint.initialName = decEndpoint.name;
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
targetsHash[decEndpoint.name] = true;


decEndpoint.unresolvable = !!decEndpoint.newly;
});


this._resolved = {};
this._installed = {};
mout.object.forOwn(setup.resolved, function (decEndpoint, name) {
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
this._resolved[name] = [decEndpoint];
