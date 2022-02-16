var util = require('util');
var Q = require('q');
var Resolver = require('../Resolver');

var FsResolver = function (endpoint, options) {
Resolver.call(this, endpoint, options);
};

util.inherits(FsResolver, Resolver);



FsResolver.prototype.hasNew = function (oldResolution) {

return Q.resolve(true);
};

FsResolver.prototype._resolveSelf = function () {
return this._copy()
.then(this._extract.bind(this));
};



FsResolver.prototype._copy = function () {
