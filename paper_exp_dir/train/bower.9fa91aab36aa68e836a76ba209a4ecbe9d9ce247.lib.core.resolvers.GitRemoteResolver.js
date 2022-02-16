var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

var GitRemoteResolver = function (source, options) {
if (!mout.string.startsWith(source, 'file://')) {

source = source.replace(/\/+$/, '');


if (!mout.string.endsWith(source, '.git')) {
source += '.git';
}
}

GitResolver.call(this, source, options);


if (this._guessedName && mout.string.endsWith(this._name, '.git')) {
this._name = this._name.slice(0, -4);
}
};

util.inherits(GitRemoteResolver, GitResolver);
mout.object.mixIn(GitRemoteResolver, GitResolver);



GitRemoteResolver.prototype._checkout = function () {
var branch;
var promise;
var resolution = this._resolution;
var deferred = Q.defer();

process.nextTick(function () {
deferred.notify({
level: 'action',
tag: 'checkout',
data: resolution.tag || resolution.branch || resolution.commit
});
});
