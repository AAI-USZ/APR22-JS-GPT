var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var copy = require('../../util/copy');
var cmd = require('../../util/cmd');
var path = require('path');

function GitFsResolver(decEndpoint, config, logger) {
GitResolver.call(this, decEndpoint, config, logger);


this._source = path.resolve(this._config.cwd, this._source);
}

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);



GitFsResolver.prototype._copy = function () {
return copy.copyDir(this._source, this._tempDir);
};


GitFsResolver.prototype._checkout = function () {
var resolution = this._resolution;



this._logger.action('checkout', resolution.tag || resolution.branch || resolution.commit, {
resolution: resolution,
to: this._tempDir
});


return this._copy()
.then(cmd.bind(cmd, 'git', ['checkout', '-f', resolution.tag || resolution.branch || resolution.commit], { cwd: this._tempDir }))

.then(cmd.bind(cmd, 'git', ['clean', '-f', '-d'], { cwd: this._tempDir }));
};




GitFsResolver.refs = function (source) {
var value;


value = this._cache.refs.get(source);
if (value) {
return Q.resolve(value);
}

value = cmd('git', ['show-ref', '--tags', '--heads'], { cwd : source })
.spread(function (stdout) {
var refs;

refs = stdout.toString()
.trim()
.replace(/[\t ]+/g, ' ')
.split(/[\r\n]+/);


this._cache.refs.set(source, refs);

return refs;
}.bind(this));



this._cache.refs.set(source);

return value;
};

module.exports = GitFsResolver;
