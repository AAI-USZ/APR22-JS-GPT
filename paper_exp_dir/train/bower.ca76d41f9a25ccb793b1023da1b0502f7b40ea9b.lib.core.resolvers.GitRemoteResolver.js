var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

function GitRemoteResolver(decEndpoint, config, logger) {
if (!mout.string.startsWith(decEndpoint.source, 'file://')) {

decEndpoint.source = decEndpoint.source.replace(/\/+$/, '');


if (!mout.string.endsWith(decEndpoint.source, '.git')) {
decEndpoint.source += '.git';
}
}

GitResolver.call(this, decEndpoint, config, logger);


if (this._guessedName && mout.string.endsWith(this._name, '.git')) {
this._name = this._name.slice(0, -4);
}
}

util.inherits(GitRemoteResolver, GitResolver);
mout.object.mixIn(GitRemoteResolver, GitResolver);



GitRemoteResolver.prototype._checkout = function () {
var branch;
var promise;
var timer;
var that = this;
var resolution = this._resolution;

this._logger.action('checkout', resolution.tag || resolution.branch || resolution.commit, {
resolution: resolution,
to: this._tempDir
});



