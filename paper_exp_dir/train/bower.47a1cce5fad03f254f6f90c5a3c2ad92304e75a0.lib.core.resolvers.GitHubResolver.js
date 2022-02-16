var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
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
this._repo = split[split.length - 1];


if (mout.string.endsWith(this._repo, '.git')) {
this._repo = this._repo.substr(0, this._repo.length - 4);
}
}

util.inherits(GitHubResolver, GitRemoteResolver);
mout.object.mixIn(GitHubResolver, GitRemoteResolver);


