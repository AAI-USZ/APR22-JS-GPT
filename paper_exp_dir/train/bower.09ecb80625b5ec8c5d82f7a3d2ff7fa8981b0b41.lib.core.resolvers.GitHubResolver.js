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


this._shallowClone = true;
}

util.inherits(GitHubResolver, GitRemoteResolver);
mout.object.mixIn(GitHubResolver, GitRemoteResolver);



GitHubResolver.prototype._checkout = function () {


if (!this._public || !this._resolution.tag) {
