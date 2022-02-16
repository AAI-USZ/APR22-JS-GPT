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



GitResolver.prototype._resolveSelf = function () {
return this._findResolution()
.then(this._checkout.bind(this))
.then(this._cleanup.bind(this));
};

GitResolver.prototype.hasNew = function (canonicalPkg) {
var oldResolution;

return this._readJson(canonicalPkg)
.then(function (meta) {
oldResolution = meta._resolution || {};
})
.then(this._findResolution.bind(this))
.then(function (resolution) {

if (oldResolution.type !== resolution.type) {
return true;
}


if (resolution.type === 'tag' && semver.neq(resolution.tag, oldResolution.tag)) {
return true;
}


return resolution.commit !== oldResolution.commit;
});
};




GitResolver.prototype._checkout = function () {
