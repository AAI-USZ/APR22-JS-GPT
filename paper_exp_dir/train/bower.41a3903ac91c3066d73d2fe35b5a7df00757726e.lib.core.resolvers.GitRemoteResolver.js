var util = require('util');
var url = require('url');
var Q = require('q');
var mout = require('mout');
var LRU = require('lru-cache');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

function GitRemoteResolver(decEndpoint, config, logger) {
GitResolver.call(this, decEndpoint, config, logger);

if (!mout.string.startsWith(this._source, 'file://')) {

this._source = this._source.replace(/\/+$/, '');
}


if (this._guessedName && mout.string.endsWith(this._name, '.git')) {
this._name = this._name.slice(0, -4);
}


if (!/:\/\
this._host = url.parse('ssh://' + this._source);
} else {
this._host = url.parse(this._source);
}
}

util.inherits(GitRemoteResolver, GitResolver);
mout.object.mixIn(GitRemoteResolver, GitResolver);



GitRemoteResolver.prototype._checkout = function () {
var promise;
var timer;
var reporter;
var that = this;
var resolution = this._resolution;

this._logger.action('checkout', resolution.tag || resolution.branch || resolution.commit, {
resolution: resolution,
to: this._tempDir
});



if (resolution.type === 'commit') {
promise = this._slowClone(resolution);

} else {
promise = this._fastClone(resolution);
}


reporter = mout['function'].throttle(function (data) {
var lines = data.split(/[\r\n]+/);

lines.forEach(function (line) {
if (/\d{1,3}\%/.test(line)) {


that._logger.info('progress', line.trim());
}
});
}, 1000);


timer = setTimeout(function () {
promise.progress(reporter);
}, 8000);

return promise

.fin(function () {
clearTimeout(timer);
});
};



GitRemoteResolver.prototype._slowClone = function (resolution) {
return cmd('git', ['clone', this._source, this._tempDir, '--progress'])
.then(cmd.bind(cmd, 'git', ['checkout', resolution.commit], { cwd: this._tempDir }));
};

GitRemoteResolver.prototype._fastClone = function (resolution) {
var branch,
args,
that = this;

branch = resolution.tag || resolution.branch;
args = ['clone',  this._source, '-b', branch, '--progress', '.'];


if (!GitRemoteResolver._noShallow.get(this._host)) {
args.push('--depth', 1);
}

return cmd('git', args, { cwd: this._tempDir })
.spread(function (stdout, stderr) {



if (!/branch .+? not found/i.test(stderr)) {
return;
}

that._logger.warn('old-git', 'It seems you are using an old version of git, it will be slower and propitious to errors!');
return cmd('git', ['checkout', resolution.commit], { cwd: that._tempDir });
}, function (err) {


if (!GitRemoteResolver._noShallow.has(that._source) &&
err.details &&
/rpc failed/i.test(err.details)
) {
GitRemoteResolver._noShallow.set(that._host, true);
return that._fastClone(resolution);
}

throw err;
});
};




GitRemoteResolver._noShallow = new LRU({ max: 50, maxAge: 5 * 60 * 1000 });


GitRemoteResolver.refs = function (source) {
var value;


value = this._cache.refs.get(source);
if (value) {
return Q.resolve(value);
}


value = cmd('git', ['ls-remote', '--tags', '--heads', source])
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

module.exports = GitRemoteResolver;
