var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var GitRemoteResolver = require('./GitRemoteResolver');
var copy = require('../../util/copy');
var cmd = require('../../util/cmd');

var GitFsResolver = function (endpoint, options) {
GitRemoteResolver.call(this, endpoint, options);
};

util.inherits(GitFsResolver, GitRemoteResolver);
