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



SvnResolver.getSource = function (source) {
var uri = this._source || source;

return uri
.replace(/^svn\+(https?|file):\/\
.replace('svn://', 'http://')
.replace(/\/+$/, '');
};

SvnResolver.prototype._hasNew = function (canonicalDir, pkgMeta) {
var oldResolution = pkgMeta._resolution || {};
