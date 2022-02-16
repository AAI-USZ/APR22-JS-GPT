var util = require('util');
var mout = require('mout');
var SvnResolver = require('./SvnResolver');
var cmd = require('../../util/cmd');

function SvnRemoteResolver(decEndpoint, config, logger) {
SvnResolver.call(this, decEndpoint, config, logger);

this._source = SvnResolver.sourceUrl(this._source);
}

util.inherits(SvnRemoteResolver, SvnResolver);
mout.object.mixIn(SvnRemoteResolver, SvnResolver);



SvnRemoteResolver.prototype._checkout = function () {
var promise;
