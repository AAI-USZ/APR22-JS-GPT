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



if (resolution.type === 'tag') {
return semver.neq(resolution.tag, oldResolution.tag);
}



return resolution.commit !== oldResolution.commit;
});
};




GitResolver.prototype._checkout = function () {};
GitResolver.fetchRefs = function (source) {};



GitResolver.prototype._findResolution = function () {
var branches,
self = this.constructor;


if (semver.valid(this._target) || semver.validRange(this._target)) {
return self.fetchVersions(this._sourcePath)
.then(function (versions) {

var version = mout.array.find(versions, function (version) {
return semver.satisfies(version, this._target);
}, this);

