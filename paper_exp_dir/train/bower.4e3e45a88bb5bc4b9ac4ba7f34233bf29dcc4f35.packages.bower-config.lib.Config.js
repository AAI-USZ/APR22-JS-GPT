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

