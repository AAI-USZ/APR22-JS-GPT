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
this._host = url.parse('ssh://' + this._source).host;
} else {
this._host = url.parse(this._source).host;
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

.fail(function (err) {
that._suggestProxyWorkaround(err);
throw err;
})

.fin(function () {
clearTimeout(timer);
});
};

GitRemoteResolver.prototype._findResolution = function (target) {
