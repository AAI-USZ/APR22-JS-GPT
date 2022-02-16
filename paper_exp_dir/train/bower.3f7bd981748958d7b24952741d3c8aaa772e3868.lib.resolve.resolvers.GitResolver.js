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


if (this._guessedName) {
this._name = path.basename(this._source, '.git');
}
};

util.inherits(GitResolver, Resolver);



GitResolver.prototype._resolveSelf = function () {
return this._findResolution()
.then(function () {
return this._checkout()



.fin(this._cleanup.bind(this));
}.bind(this));
};

GitResolver.prototype.hasNew = function (canonicalPkg) {
var oldResolution;
