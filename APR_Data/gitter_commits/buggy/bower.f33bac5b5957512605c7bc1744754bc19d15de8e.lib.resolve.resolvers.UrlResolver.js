var util = require('util');
var Q = require('q');
var Resolver = require('../Resolver');

var UrlResolver = function (endpoint, options) {
    Resolver.call(this, endpoint, options);
};

util.inherits(UrlResolver, Resolver);

// -----------------

UrlResolver.prototype._resolveSelf = function () {
    return this._download()
    .then(this._extract.bind(this));
};

UrlResolver.prototype._download = function () {

};

UrlResolver.prototype._extract = function () {

};

module.exports = UrlResolver;