var util = require('util');
var fs = require('fs');
var path = require('path');
var events = require('events');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var config = require('../config');
var createError = require('../util/createError');

var Resolver = function (source, options) {
options = options || {};

this._source = source;
this._target = options.target || '*';
this._name = options.name;
this._guessedName = !this.name;
this._config = options.config || config;
};

util.inherits(Resolver, events.EventEmitter);



Resolver.prototype.getSource = function () {
return this._name;
};

Resolver.prototype.getTarget = function () {
return this._target;
};

Resolver.prototype.getTempDir = function () {
return this._tempDir;
};

Resolver.prototype.resolve = function () {

return this._createTempDir()

.then(this._resolveSelf.bind(this))

.then(this._readJson.bind(this))

.then(this._parseJson.bind(this));
};

Resolver.prototype.isCacheable = function () {
return false;
};

Resolver.prototype.getDependencies = function () {
return this._json.dependencies;
};



Resolver.prototype.hasNew = function (oldResolution) {
return true;
};

Resolver.prototype._resolveSelf = function () {};



Resolver.prototype._createTempDir = function () {
var baseDir = path.join(tmp.tmpdir, 'bower');

return Q.nfcall(mkdirp, baseDir)
.then(function () {
return Q.nfcall(tmp.dir, {
template: path.join(baseDir, this._name + '-XXXXXX'),
mode: parseInt('0777', 8) & (~process.umask()),

});
}.bind(this))
.then(function (dir) {

require('../util/cmd')('open', [dir]);

this._tempDir = dir;
return dir;
}.bind(this));
};

Resolver.prototype._readJson = function () {
var jsonFile;


jsonFile = path.join(this.getTempDir(), 'bower.json');
return Q.nfcall(fs.readFile, jsonFile)

.then(null, function (err) {
if (err.code !== 'ENOENT') {
throw err;
}

jsonFile = path.join(this.getTempDir(), 'component.json');
return Q.nfcall(fs.readFile, jsonFile)

.then(function (contents) {
this.emit('warn', 'Package "' + this.name + '" is using the deprecated component.json file');
return contents;
}.bind(this));
}.bind(this))

.then(function (contents) {

try {
this._json = JSON.parse(contents);
return this._json;
} catch (e) {
throw createError('Unable to parse "' + jsonFile + '" file', e.code, {
details: e.message
});
}

}.bind(this), function (err) {

if (err.code === 'ENOENT') {
this._json = { name: this.name };
return this._json;
}


throw err;
}.bind(this));
};

Resolver.prototype._parseJson = function () {


if (this._guessedName && this._json.name !== this.name) {
this.name = this._json.name;
this.emit('name_change', this.name);
}

this._json.dependencies = this._json.dependencies || {};


return Q.fcall(function () {


}.bind(this));
};

module.exports = Resolver;
