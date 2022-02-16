var util = require('util');
var path = require('path');
var mout = require('mout');
var GitRemoteResolver = require('./GitRemoteResolver');
var download = require('../../util/download');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function GitHubResolver(decEndpoint, config, logger) {
var pair;

GitRemoteResolver.call(this, decEndpoint, config, logger);



pair = GitHubResolver.getOrgRepoPair(this._source);
if (!pair) {
throw createError('Invalid GitHub URL', 'EINVEND', {
details: this._source + ' does not seem to be a valid GitHub URL'
});
}

this._org = pair.org;
this._repo = pair.repo;


if (!mout.string.endsWith(this._source, '.git')) {
this._source += '.git';
}


this._public = mout.string.startsWith(this._source, 'git://');


if (this._config.proxy || this._config.httpsProxy) {
this._source = this._source.replace('git://', 'https://');
}
}

util.inherits(GitHubResolver, GitRemoteResolver);
mout.object.mixIn(GitHubResolver, GitRemoteResolver);



GitHubResolver.prototype._checkout = function () {


if (!this._public || !this._resolution.tag) {
return GitRemoteResolver.prototype._checkout.call(this);
}

var msg;
var tarballUrl = 'https://github.com/' + this._org + '/' + this._repo + '/archive/' + this._resolution.tag + '.tar.gz';
var file = path.join(this._tempDir, 'archive.tar.gz');
var reqHeaders = {};
var that = this;

if (this._config.userAgent) {
reqHeaders['User-Agent'] = this._config.userAgent;
}

this._logger.action('download', tarballUrl, {
url: that._source,
to: file
});


return download(tarballUrl, file, {
proxy: this._config.httpsProxy,
strictSSL: this._config.strictSsl,
timeout: this._config.timeout,
headers: reqHeaders
})
.progress(function (state) {

if (state.retry) {
msg = 'Download of ' + tarballUrl + ' failed with ' + state.error.code + ', ';
msg += 'retrying in ' + (state.delay / 1000).toFixed(1) + 's';
that._logger.debug('error', state.error.message, { error: state.error });
return that._logger.warn('retry', msg);
}


msg = 'received ' + (state.received / 1024 / 1024).toFixed(1) + 'MB';
if (state.total) {
msg += ' of ' + (state.total / 1024 / 1024).toFixed(1) + 'MB downloaded, ';
msg += state.percent + '%';
}
that._logger.info('progress', msg);
})
.then(function () {

that._logger.action('extract', path.basename(file), {
