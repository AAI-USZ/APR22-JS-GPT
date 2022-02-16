var utils = require('../utils');
var pathRegexp = require('path-to-regexp');
var debug = require('debug')('express:router:layer');

function Layer(path, options, fn) {
if (!(this instanceof Layer)) {
return new Layer(path, options, fn);
}

debug('new %s', path);
