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


if (endpoints) {

mout.object.forOwn(endpoints, function (decEndpoint) {
toBeResolved.push(decEndpoint);
}, this);



mout.object.forOwn(locals, function (decEndpoint) {
if (jsons[decEndpoint.name] && !endpoints[decEndpoint.name]) {
resolved.push(decEndpoint);
}
}, this);

} else {






mout.object.forOwn(jsons, function (decEndpoint) {
var local = locals[decEndpoint.name];

if (!local || !this._manager.areCompatible(local, decEndpoint)) {
toBeResolved.push(decEndpoint);
} else {
resolved.push(local);
}
