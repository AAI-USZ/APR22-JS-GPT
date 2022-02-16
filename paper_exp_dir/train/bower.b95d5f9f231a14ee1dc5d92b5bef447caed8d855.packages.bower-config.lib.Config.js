var lang = require('mout/lang');
var object = require('mout/object');
var rc = require('./util/rc');
var defaults = require('./util/defaults');
var expand = require('./util/expand');
var path = require('path');

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
