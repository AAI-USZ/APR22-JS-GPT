var util = require('util');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mout = require('mout');
var Resolver = require('../Resolver');
var createError = require('../../util/createError');

var GitResolver = function (source, options) {
Resolver.call(this, source, options);
};

util.inherits(GitResolver, Resolver);
mout.object.mixIn(GitResolver, Resolver);



GitResolver.prototype._resolveSelf = function () {
return this._findResolution()
.then(function () {
return this._checkout()

