var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var mout = require('mout');
var request = require('request');
var progress = require('request-progress');
var GitRemoteResolver = require('./GitRemoteResolver');
var extract = require('../../util/extract');

function GitHubResolver(decEndpoint, config, logger) {
var split;

GitRemoteResolver.call(this, decEndpoint, config, logger);


split = this._source.split('/');
this._org = split[split.length - 2];
this._repo = split[split.length - 1];


if (mout.string.endsWith(this._repo, '.git')) {
this._repo = this._repo.substr(0, this._repo.length - 4);
}
}

util.inherits(GitHubResolver, GitRemoteResolver);
mout.object.mixIn(GitHubResolver, GitRemoteResolver);



GitHubResolver.prototype._checkout = function () {

if (!this._resolution.tag) {
return GitRemoteResolver.prototype._checkout.call(this);
}

var tarballUrl = 'http://github.com/' + this._org + '/' + this._repo + '/archive/' + this._resolution.tag + '.tar.gz';
var file = path.join(this._tempDir, 'archive.tar.gz');
var reqHeaders = {};
var that = this;
var deferred = Q.defer();

if (this._config.userAgent) {
reqHeaders['User-Agent'] = this._config.userAgent;
}

this._logger.action('download', tarballUrl, {
url: that._source,
to: file
});


progress(request(tarballUrl, {
proxy: this._config.proxy,
strictSSL: this._config.strictSsl,
timeout: 5000,
headers: reqHeaders,
agent: false
}), {
delay: 8000
})
.on('progress', function (state) {
var totalMb = Math.round(state.total / 1024 / 1024);
var receivedMb = Math.round(state.received / 1024 / 1024);

that._logger.info('progress', receivedMb + 'MB of ' + totalMb + 'MB downloaded, ' + state.percent + '%');
})
.on('error', deferred.reject)
