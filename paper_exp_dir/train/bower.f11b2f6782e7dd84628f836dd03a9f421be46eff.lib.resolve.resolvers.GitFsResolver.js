var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var copy = require('../../util/copy');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (source, options) {

source = path.resolve(source);

GitResolver.call(this, source, options);
};

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);



GitFsResolver.prototype._copy = function () {
return copy.copyDir(this._source, this._tempDir);
};


GitFsResolver.prototype._checkout = function () {
var resolution = this._resolution;


