var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var mout = require('mout');
var request = require('request');
var progress = require('request-progress');
var replay = require('request-replay');
var GitRemoteResolver = require('./GitRemoteResolver');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function GitHubResolver(decEndpoint, config, logger) {
var split;

GitRemoteResolver.call(this, decEndpoint, config, logger);


this._public = mout.string.startsWith(this._source, 'git://');


split = this._source.split('/');
