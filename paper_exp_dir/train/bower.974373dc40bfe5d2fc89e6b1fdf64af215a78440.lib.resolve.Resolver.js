var fs = require('fs');
var path = require('path');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var bowerJson = require('bower-json');
var glob = require('glob');
var config = require('../config');
var createError = require('../util/createError');

tmp.setGracefulCleanup();

var Resolver = function (source, options) {
options = options || {};

this._source = source;
this._target = options.target || '*';
this._name = options.name || path.basename(this._source);
this._guessedName = !options.name;
this._config = options.config || config;
};



Resolver.prototype.getSource = function () {
return this._source;
};

Resolver.prototype.getName = function () {
return this._name;
};

Resolver.prototype.getTarget = function () {
return this._target;
};

Resolver.prototype.getTempDir = function () {
return this._tempDir;
};

Resolver.prototype.hasNew = function (canonicalPkg) {
return Q.resolve(true);
};

Resolver.prototype.resolve = function () {
var that = this;




if (this._resolving) {
throw new Error('Already resolving');
}

this._resolving = true;


return this._createTempDir()

