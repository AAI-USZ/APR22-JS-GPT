var util = require('util');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var Resolver = require('./Resolver');
var cmd = require('../../util/cmd');
var createError = require('../../util/createError');

var GitRemoteResolver = function (source, options) {
Resolver.call(this, source, options);
};

util.inherits(GitRemoteResolver, Resolver);



GitRemoteResolver.prototype._resolveSelf = function () {
return this.constructor.findResolution(this._source, this._target)
.then(this._checkout.bind(this));
};

GitRemoteResolver.prototype.hasNew = function (oldTarget, oldResolution) {
return this.constructor.findResolution(this._source, this._target)
.then(function (resolution) {

if (oldResolution.type !== resolution.type) {
return true;
