var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

var GitRemoteResolver = function (source, options) {
GitResolver.call(this, source, options);
};

util.inherits(GitRemoteResolver, GitResolver);
mout.object.mixIn(GitRemoteResolver, GitResolver);



GitRemoteResolver.prototype._checkout = function () {
var branch,
resolution = this._resolution;

console.log(resolution);



if (resolution.type === 'commit') {
return cmd('git', ['clone', this._source, this._tempDir])
.then(cmd.bind(cmd, 'git', ['checkout', resolution.commit], { cwd: this._tempDir }));

} else {
branch = resolution.tag || resolution.branch;
return cmd('git', ['clone',  this._source, '-b', branch, '--depth', 1, '.'], { cwd: this._tempDir });
}
};




GitRemoteResolver.fetchRefs = function (source) {
if (this._refs && this._refs[source]) {
return Q.resolve(this._refs[source]);
}

return cmd('git', ['ls-remote', '--tags', '--heads', source])
.then(function (stdout) {

var refs = stdout.toString().trim().split('\n');

this._refs = this._refs  || {};
return this._refs[source] = refs;
}.bind(this));
};

module.exports = GitRemoteResolver;
