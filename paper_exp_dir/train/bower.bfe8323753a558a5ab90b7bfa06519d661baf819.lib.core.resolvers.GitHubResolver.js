var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var url = require('url');
var Q = require('q');
var mout = require('mout');
var request = require('request');
var GitRemoteResolver = require('./GitRemoteResolver');
var extract = require('../../util/extract');

function GitHubResolver(decEndpoint, config, logger) {
var split;

GitRemoteResolver.call(this, decEndpoint, config, logger);


split = this._source.split('/');

this._org = split[split.length - 2];
this._repo = mout.string.rtrim(split[split.length - 1], '.git');
}

util.inherits(GitHubResolver, GitRemoteResolver);
mout.object.mixIn(GitHubResolver, GitRemoteResolver);



GitHubResolver.prototype._checkout = function () {

if (!this._resolution.tag) {
return GitRemoteResolver.prototype._checkout.call(this);
}

var tarballUrl = 'http://github.com/' + this._org + '/' + this._repo + '/archive/' + this._resolution.tag + '.tar.gz';
var remote = url.parse(tarballUrl);
var file = path.join(this._tempDir, 'archive.tar.gz');
var reqHeaders = {};
var that = this;
