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

Config.prototype.load = function () {
this._config = rc('bower', defaults, this._cwd);
this._proxy.set(this._config);
return this;
};

Config.prototype.restore = function () {
this._proxy.restore();
};

function readCertFile(path) {
path = path || '';

var sep = '-----END CERTIFICATE-----';

var certificates;

if (path.indexOf(sep) === -1) {
certificates = fs.readFileSync(path, { encoding: 'utf8' });
} else {
certificates = path;
}

