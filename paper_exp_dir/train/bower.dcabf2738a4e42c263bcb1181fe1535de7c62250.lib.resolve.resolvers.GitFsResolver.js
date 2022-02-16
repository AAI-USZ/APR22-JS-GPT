var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var ncp = require('ncp');
var GitRemoteResolver = require('./GitRemoteResolver');
var cmd = require('../../util/cmd');

var GitFsResolver = function (endpoint, options) {
GitRemoteResolver.call(this, endpoint, options);
};

util.inherits(GitFsResolver, GitRemoteResolver);



GitFsResolver.prototype._resolveSelf = function () {
var self = this.constructor;

return this._copy()
.then(this._fetch.bind(this))
.then(self.findResolution.bind(self, this._tempDir, this._target))
.then(this._checkout.bind(this));
};



GitFsResolver.prototype._copy = function () {
var tempDir = this._tempDir;


return Q.nfcall(fs.stat, this._source)
.then(function (stat) {
return Q.nfcall(fs.chmod, tempDir, stat.mode);
})

.then(function () {
return Q.nfcall(ncp, this._source, tempDir);
});
};

GitFsResolver.prototype._fetch = function () {
var dir = this._tempDir;

