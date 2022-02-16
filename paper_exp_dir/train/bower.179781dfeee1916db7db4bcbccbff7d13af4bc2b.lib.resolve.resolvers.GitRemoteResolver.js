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



if (resolution.type === 'commit') {
return cmd('git', ['clone', this._source, this._tempDir])
.then(cmd.bind(cmd, 'git', ['checkout', resolution.commit], { cwd: this._tempDir }));

} else {
branch = resolution.tag || resolution.branch;
return cmd('git', ['clone',  this._source, '-b', branch, '--depth', 1, '.'], { cwd: this._tempDir });
}
};
