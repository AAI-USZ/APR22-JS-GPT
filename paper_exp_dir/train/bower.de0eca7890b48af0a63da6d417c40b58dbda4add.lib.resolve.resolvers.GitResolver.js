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



GitResolver.prototype._hasNew = function (pkgMeta) {
var oldResolution = pkgMeta._resolution || {};

return this._findResolution()
.then(function (resolution) {

if (oldResolution.type !== resolution.type) {
return true;
}


if (resolution.type === 'version' && semver.neq(resolution.tag, oldResolution.tag)) {
return true;
}


return resolution.commit !== oldResolution.commit;
});
};

GitResolver.prototype._resolve = function () {
return this._findResolution()
.then(function () {
return this._checkout()



.fin(this._cleanup.bind(this));
}.bind(this));
};




GitResolver.prototype._checkout = function () {
throw new Error('_checkout not implemented');
};

GitResolver.fetchRefs = function (source) {
throw new Error('fetchRefs not implemented');
};



GitResolver.prototype._findResolution = function (target) {
var self = this.constructor;
var err;

target = target || this._target;
