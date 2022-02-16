var util = require('util');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var Resolver = require('./Resolver');
var copy = require('../../util/copy');
var extract = require('../../util/extract');
var createError = require('../../util/createError');
var junk = require('junk');

var FsResolver = function (source, options) {
Resolver.call(this, source, options);


this._source = path.resolve(this._config.cwd, source);


if (this._target !== '*') {
throw createError('File system sources can\'t resolve targets', 'ENORESTARGET');
}
};

util.inherits(FsResolver, Resolver);
mout.object.mixIn(FsResolver, Resolver);









FsResolver.prototype._resolve = function () {
return this._readJson(this._source)
.then(this._copy.bind(this))
.then(this._extract.bind(this))
.then(this._rename.bind(this));
};



FsResolver.prototype._copy = function (meta) {
var that = this;
var deferred = Q.defer();

process.nextTick(function () {
deferred.notify({
level: 'action',
tag: 'copy',
data: that._source,
source: that._source
});
