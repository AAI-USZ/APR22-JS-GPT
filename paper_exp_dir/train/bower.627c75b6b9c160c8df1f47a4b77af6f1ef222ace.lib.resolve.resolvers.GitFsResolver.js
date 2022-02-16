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
.then(this._readJson.bind(this, this._source))
.then(this._copy.bind(this))
.then(this._checkout.bind(this))
.then(this._cleanup.bind(this));
};



GitFsResolver.prototype._copy = function (meta) {
var ignore = meta.ignore;


return Q.nfcall(fs.stat, this._source)
.then(function (stat) {
return Q.nfcall(fs.chmod, this._tempDir, stat.mode);
}.bind(this))

.then(function () {
return Q.nfcall(ncp, this._source, this._tempDir, {

filter: ignore && ignore.length ? this._createIgnoreFilter(ignore) : null
});
}.bind(this));
};


GitFsResolver.prototype._checkout = function () {
var resolution = this._resolution;

console.log(resolution);


return cmd('git', ['checkout', '-f', resolution.tag || resolution.branch || resolution.commit], { cwd: this._tempDir })

.then(cmd.bind(cmd, 'git', ['clean', '-f', '-d'], { cwd: this._tempDir }));
};




GitFsResolver.fetchRefs = function (source) {
if (this._refs && this._refs[source]) {
return Q.resolve(this._refs[source]);
}

return cmd('git', ['show-ref', '--tags', '--heads'], { cwd : source })
.then(function (stdout) {

var refs = stdout.toString().trim().split('\n');

this._refs = this._refs  || {};
return this._refs[source] = refs;
}.bind(this));
};

module.exports = GitFsResolver;
