var lang = require('mout/lang');
var object = require('mout/object');
var rc = require('./util/rc');
var expand = require('./util/expand');
var EnvProxy = require('./util/proxy');
var path = require('path');
var fs = require('fs');

function Config(cwd) {
this._cwd = cwd;
this._proxy = new EnvProxy();
this._config = {};
}

Config.prototype.load = function(overwrites) {
this._config = rc('bower', this._cwd);

this._config = object.merge(
expand(this._config || {}),
expand(overwrites || {})
);

this._config = normalise(this._config);

this._proxy.set(this._config);

return this;
};

Config.prototype.restore = function() {
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

return certificates
.split(sep)
.filter(function(s) {
return !s.match(/^\s*$/);
})
.map(function(s) {
return s + sep;
});
