var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var ncp = require('ncp');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (endpoint, options) {
GitResolver.call(this, endpoint, options);




this._source = path.resolve(this._source);
};

util.inherits(GitFsResolver, GitResolver);
