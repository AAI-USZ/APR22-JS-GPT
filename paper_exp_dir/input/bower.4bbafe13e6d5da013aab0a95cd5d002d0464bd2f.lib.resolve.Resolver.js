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

};

