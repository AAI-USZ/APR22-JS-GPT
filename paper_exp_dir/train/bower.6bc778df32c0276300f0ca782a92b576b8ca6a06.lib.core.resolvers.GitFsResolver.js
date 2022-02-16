var util = require('util');
var Q = require('q');
var mout = require('mout');
var path = require('path');
var GitResolver = require('./GitResolver');
var copy = require('../../util/copy');
var cmd = require('../../util/cmd');

function GitFsResolver(decEndpoint, config, logger) {
GitResolver.call(this, decEndpoint, config, logger);


this._source = path.resolve(this._config.cwd, this._source);
}

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);




GitFsResolver.prototype._checkout = function() {
var resolution = this._resolution;



this._logger.action(
'checkout',
resolution.tag || resolution.branch || resolution.commit,
{
resolution: resolution,
to: this._tempDir
}
);


