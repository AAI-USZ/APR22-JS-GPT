var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var copy = require('../../util/copy');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (source, options) {
GitResolver.call(this, source, options);


this._source = path.resolve(this._config.cwd, source);
};

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);



GitFsResolver.prototype._copy = function () {
return copy.copyDir(this._source, this._tempDir);
};


GitFsResolver.prototype._checkout = function () {
var resolution = this._resolution;
var deferred = Q.defer();




process.nextTick(function () {
deferred.notify({
level: 'action',
tag: 'checkout',
data: resolution.tag || resolution.branch || resolution.commit
});
});


this._copy()
.then(cmd.bind(cmd, 'git', ['checkout', '-f', resolution.tag || resolution.branch || resolution.commit], { cwd: this._tempDir }))
