var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var ncp = require('ncp');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (endpoint, options) {
GitResolver.call(this, endpoint, options);




this._source = path.resolve(this._source);
};

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);



GitFsResolver.prototype._resolveSelf = function () {
this._sourcePath = this._tempDir;

return this._copy()
.then(this._fetch.bind(this))
.then(this._findResolution.bind(this))
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
}.bind(this));
};

GitFsResolver.prototype._fetch = function () {
var dir = this._tempDir;


return cmd('git', ['remote'], { cwd: dir })
.then(function (stdout) {
var hasRemote = !!stdout.trim().length;


if (hasRemote) {
return cmd('git', ['fetch']);
}
});
};


GitFsResolver.prototype._checkout = function (resolution) {
var dir = this._tempDir;

console.log(resolution);


return cmd('git', ['checkout', '-f', resolution.tag || resolution.branch || resolution.commit], { cwd: dir })

.then(function () {
return cmd('git', ['clean', '-f', '-d'], { cwd: dir });
});
};




GitFsResolver.fetchRefs = function (source) {
if (this._refs && this._refs[source]) {
return Q.resolve(this._refs[source]);
}

return cmd('git', ['show-ref', '--tags', '--heads'], { cwd : source })
.then(function (stdout) {

var refs = stdout.toString().split('\n');

this._refs = this._refs  || {};
return this._refs[source] = refs;
}.bind(this));
};

module.exports = GitFsResolver;
