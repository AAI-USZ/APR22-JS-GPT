var util = require('util');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var ncp = require('ncp');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (source, options) {



source = path.resolve(this._source);

GitResolver.call(this, source, options);
};

util.inherits(GitFsResolver, GitResolver);
mout.object.mixIn(GitFsResolver, GitResolver);



GitFsResolver.prototype._resolveSelf = function () {
return this._findResolution()
.then(this._readJson.bind(this, this._source))
.then(this._copy.bind(this))
.then(this._checkout.bind(this));
};



GitFsResolver.prototype._copy = function (meta) {
var ignore = meta.ignore;


return Q.nfcall(fs.stat, this._source)
