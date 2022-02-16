var util = require('util');
var Q = require('q');
var Resolver = require('../Resolver');

var UrlResolver = function (source, options) {
Resolver.call(this, source, options);


};

util.inherits(UrlResolver, Resolver);



UrlResolver.prototype.hasNew = function (oldResolution) {

Q.resolve(true);
};

UrlResolver.prototype._resolveSelf = function () {
