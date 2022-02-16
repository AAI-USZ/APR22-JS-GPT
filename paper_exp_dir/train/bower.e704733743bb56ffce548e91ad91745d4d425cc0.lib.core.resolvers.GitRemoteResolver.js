var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

function GitRemoteResolver(decEndpoint, config, logger) {
if (!mout.string.startsWith(decEndpoint.source, 'file://')) {

decEndpoint.source = decEndpoint.source.replace(/\/+$/, '');


if (!mout.string.endsWith(decEndpoint.source, '.git')) {
decEndpoint.source += '.git';
}
}

GitResolver.call(this, decEndpoint, config, logger);


if (this._guessedName && mout.string.endsWith(this._name, '.git')) {
this._name = this._name.slice(0, -4);
}
}

util.inherits(GitRemoteResolver, GitResolver);
mout.object.mixIn(GitRemoteResolver, GitResolver);



GitRemoteResolver.prototype._checkout = function () {
var branch;
var promise;
var resolution = this._resolution;

this._logger.action('checkout', resolution.tag || resolution.branch || resolution.commit, {
resolution: resolution,
to: this._tempDir
});



if (resolution.type === 'commit') {
promise = cmd('git', ['clone', this._source, this._tempDir])
.then(cmd.bind(cmd, 'git', ['checkout', resolution.commit], { cwd: this._tempDir }));

} else {
branch = resolution.tag || resolution.branch;
promise = cmd('git', ['clone',  this._source, '-b', branch, '--depth', 1, '.'], { cwd: this._tempDir });
}

return promise;
};




GitRemoteResolver.fetchRefs = function (source) {
var cache;


this._refs = this._refs || {};

cache = this._refs[source];
if (cache) {


if (cache.then) {
return cache;
}



return Q.resolve(cache);
}


return this._refs[source] = cmd('git', ['ls-remote', '--tags', '--heads', source])
.then(function (stdout) {
var refs;

refs = stdout.toString()
.trim()
.replace(/[\t ]+/g, ' ')
.split(/\r?\n/);


return this._refs[source] = refs;
}.bind(this));
};

module.exports = GitRemoteResolver;
