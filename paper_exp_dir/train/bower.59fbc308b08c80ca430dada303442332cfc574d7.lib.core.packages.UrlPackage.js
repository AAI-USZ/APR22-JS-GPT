var util = require('util');
var Q = require('q');
var Package = require('../Package');

var UrlPackage = function (endpoint, options) {
Package.call(this, endpoint, options);
};

util.inherits(UrlPackage, Package);



UrlPackage.prototype._resolveSelf = function () {
var promise;

console.log('_resolveSelf of url package');
promise = this._download()
.then(this._extract.bind(this));

return promise;
};

UrlPackage.prototype._download = function () {
var deferred = Q.defer();

console.log('_download');
setTimeout(function () {
deferred.resolve();
}, 1000);

return deferred.promise;
};

UrlPackage.prototype._extract = function () {
var deferred = Q.defer();



console.log('_extract');
setTimeout(function () {
deferred.resolve();
}, 1000);

return deferred.promise;
};

module.exports = UrlPackage;
