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
