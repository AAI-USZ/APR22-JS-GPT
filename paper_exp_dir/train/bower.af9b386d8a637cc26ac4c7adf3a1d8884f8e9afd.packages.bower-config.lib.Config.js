var lang = require('mout/lang');
var object = require('mout/object');
var rc = require('./util/rc');
var defaults = require('./util/defaults');
var expand = require('./util/expand');
var path = require('path');
var fs = require('fs');

function Config(cwd) {
this._cwd = cwd || process.cwd();
this._config = {};
}

Config.prototype.load = function () {
this._config = rc('bower', defaults, this._cwd);
return this;
};

Config.prototype.get = function (key) {

};

Config.prototype.set = function (key, value) {

return this;
};

Config.prototype.del = function (key, value) {

return this;
};

Config.prototype.save = function (where, callback) {

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
