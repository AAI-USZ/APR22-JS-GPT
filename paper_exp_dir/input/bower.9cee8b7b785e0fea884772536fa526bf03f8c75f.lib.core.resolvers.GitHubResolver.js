var util = require('util');
var path = require('path');
var mout = require('mout');
var GitRemoteResolver = require('./GitRemoteResolver');
var download = require('../../util/download');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function GitHubResolver(decEndpoint, config, logger) {
var match;

GitRemoteResolver.call(this, decEndpoint, config, logger);


this._public = mout.string.startsWith(this._source, 'git://');


