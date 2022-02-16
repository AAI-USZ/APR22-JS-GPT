var util = require('util');
var path = require('path');
var Q = require('q');
var rimraf = require('rimraf');
var which = require('which');
var LRU = require('lru-cache');
var mout = require('mout');
var Resolver = require('./Resolver');
var semver = require('../../util/semver');
var createError = require('../../util/createError');
var cmd = require('../../util/cmd');

var hasSvn;


try {
which.sync('svn');
hasSvn = true;
} catch (ex) {
hasSvn = false;
}

function SvnResolver(decEndpoint, config, logger) {
Resolver.call(this, decEndpoint, config, logger);

if (!hasSvn) {
throw createError('svn is not installed or not in the PATH', 'ENOSVN');
}
}

util.inherits(SvnResolver, Resolver);
mout.object.mixIn(SvnResolver, Resolver);



SvnResolver.prototype._hasNew = function (canonicalDir, pkgMeta) {
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

SvnResolver.prototype._resolve = function () {
var that = this;

return this._findResolution()
.then(function () {
return that._checkout()



.fin(function () {
return that._cleanup();
});
});
};




SvnResolver.prototype._checkout = function () {
throw new Error('_checkout not implemented');
};



SvnResolver.prototype._findResolution = function (target) {
var err;
var self = this.constructor;
var that = this;

target = target || this._target || '*';


this._source = SvnResolver.sourceUrl(this._source);



if ((/^r\d+/).test(target)) {
target = target.split('r');

this._resolution = { type: 'commit', commit: target[1] };
return Q.resolve(this._resolution);
}

