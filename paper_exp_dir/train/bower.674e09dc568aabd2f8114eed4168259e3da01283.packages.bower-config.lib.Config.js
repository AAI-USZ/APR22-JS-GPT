var lang = require('mout/lang');
var object = require('mout/object');
var rc = require('./util/rc');
var defaults = require('./util/defaults');
var expand = require('./util/expand');
var EnvProxy = require('./util/proxy');
var path = require('path');
var fs = require('fs');

function Config(cwd) {
this._cwd = cwd || process.cwd();
this._proxy = new EnvProxy();
this._config = {};
}

Config.prototype.load = function (overwrites) {
this._config = rc('bower', defaults, this._cwd);

this._config = object.merge(this._config, overwrites || {});

this._config = Config.normalise(this._config);

loadCAs(this._config.ca);

this._proxy.set(this._config);

return this;
};

Config.prototype.restore = function () {
