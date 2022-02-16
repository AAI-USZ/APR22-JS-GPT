var util = require('util');
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





return this._copy()
.then(cmd.bind(cmd, 'git', ['checkout', '-f', resolution.tag || resolution.branch || resolution.commit], { cwd: this._tempDir }))

.then(cmd.bind(cmd, 'git', ['clean', '-f', '-d'], { cwd: this._tempDir }));
};




GitFsResolver.fetchRefs = function (source) {
var cache;

this._refs = this._refs || {};

cache = this._refs[source];
if (cache) {


if (cache.then) {
return cache;
}



return Q.resolve(cache);
}


return this._refs[source] = cmd('git', ['show-ref', '--tags', '--heads'], { cwd : source })
.then(function (stdout) {

var refs = stdout.toString()
.trim()
.replace(/[\t ]+/g, ' ')
.split(/\r?\n/);


return this._refs[source] = refs;
}.bind(this));
};

module.exports = GitFsResolver;
