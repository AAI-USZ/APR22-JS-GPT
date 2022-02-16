var util = require('util');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var Resolver = require('../Resolver');
var copy = require('../../util/copy');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

var FsResolver = function (source, options) {

source = path.resolve(source);

Resolver.call(this, source, options);
};

util.inherits(FsResolver, Resolver);
mout.object.mixIn(FsResolver, Resolver);



FsResolver.prototype.hasNew = function (canonicalPkg) {

if (this._target !== '*') {
return Q.reject(createError('File system sources can\'t resolve targets ("' + this._target + '")', 'ENORESTARGET'));
}


return Q.resolve(true);
};

FsResolver.prototype._resolveSelf = function () {

if (this._target !== '*') {
return Q.reject(createError('File system sources can\'t resolve targets ("' + this._target + '")', 'ENORESTARGET'));
}

return this._readJson(this._source)
.then(this._copy.bind(this))
.spread(function (stat, file) {
if (stat.isFile() && extract.canExtract(file)) {
return this._extract(file);
}
}.bind(this));
};



FsResolver.prototype._copy = function (meta) {
