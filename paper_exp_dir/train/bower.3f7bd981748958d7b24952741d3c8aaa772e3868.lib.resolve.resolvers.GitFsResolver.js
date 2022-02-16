var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var ncp = require('ncp');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (source, options) {

source = path.resolve(source);

GitResolver.call(this, source, options);
};

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);



GitFsResolver.prototype._copy = function () {

return Q.nfcall(fs.stat, this._source)
.then(function (stat) {
return Q.nfcall(fs.chmod, this._tempDir, stat.mode);
}.bind(this))

.then(function () {
return Q.nfcall(ncp, this._source, this._tempDir);
}.bind(this));
