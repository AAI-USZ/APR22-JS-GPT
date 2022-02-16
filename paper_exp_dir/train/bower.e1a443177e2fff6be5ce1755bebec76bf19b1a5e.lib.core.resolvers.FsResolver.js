var util = require('util');
var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var junk = require('junk');
var Resolver = require('./Resolver');
var copy = require('../../util/copy');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function FsResolver(decEndpoint, config, logger) {
Resolver.call(this, decEndpoint, config, logger);


this._source = path.resolve(this._config.cwd, this._source);


if (this._target !== '*') {
throw createError('File system sources can\'t resolve targets', 'ENORESTARGET');
}
}

util.inherits(FsResolver, Resolver);
mout.object.mixIn(FsResolver, Resolver);



FsResolver.isTargetable = function () {
return false;
};







FsResolver.prototype._resolve = function () {
return this._copy()
.then(this._extract.bind(this))
.then(this._rename.bind(this));
};



FsResolver.prototype._copy = function () {
var that = this;

return Q.nfcall(fs.stat, this._source)
.then(function (stat) {
