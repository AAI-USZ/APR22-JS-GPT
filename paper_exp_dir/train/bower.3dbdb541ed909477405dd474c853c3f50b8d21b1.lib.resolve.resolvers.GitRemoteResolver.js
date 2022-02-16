var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

var GitRemoteResolver = function (source, options) {
GitResolver.call(this, source, options);
};

util.inherits(GitRemoteResolver, GitResolver);
mout.object.mixIn(GitRemoteResolver, GitResolver);



GitRemoteResolver.prototype._checkout = function (resolution) {
var dir = this._tempDir,
branch;

console.log(resolution);



if (resolution.type === 'commit') {
return cmd('git', ['clone', this._source, '.'], { cwd: dir })
.then(function () {
