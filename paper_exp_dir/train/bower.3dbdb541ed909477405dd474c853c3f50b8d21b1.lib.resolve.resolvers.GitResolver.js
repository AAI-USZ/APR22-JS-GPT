var util = require('util');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var Resolver = require('../Resolver');
var createError = require('../../util/createError');

var GitResolver = function (source, options) {
Resolver.call(this, source, options);




this._sourcePath = this._source;
};

util.inherits(GitResolver, Resolver);



GitResolver.prototype._resolveSelf = function () {
return this._findResolution()
.then(this._checkout.bind(this));
};

GitResolver.prototype.hasNew = function (oldTarget, oldResolution) {
return this._findResolution()
.then(function (resolution) {

if (oldResolution.type !== resolution.type) {
return true;
}
