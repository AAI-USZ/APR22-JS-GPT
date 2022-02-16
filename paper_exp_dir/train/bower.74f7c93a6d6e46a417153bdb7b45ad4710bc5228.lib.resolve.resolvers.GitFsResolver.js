var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var ncp = require('ncp');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (source, options) {



source = path.resolve(this._source);

GitResolver.call(this, source, options);
};

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);



GitFsResolver.prototype._resolveSelf = function () {
return this._findResolution()
.then(this._copy.bind(this))
.then(function () {
return this._checkout(this._resolution);
}.bind(this));
};



GitFsResolver.prototype._copy = function () {
var tempDir = this._tempDir;


return Q.nfcall(fs.stat, this._source)
.then(function (stat) {
return Q.nfcall(fs.chmod, tempDir, stat.mode);
})

.then(function () {
return Q.nfcall(ncp, this._source, tempDir);
}.bind(this));
};


GitFsResolver.prototype._checkout = function (resolution) {
var dir = this._tempDir;

console.log(resolution);

