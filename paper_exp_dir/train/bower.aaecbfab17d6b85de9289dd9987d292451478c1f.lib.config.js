var tty = require('tty');
var object = require('mout').object;
var bowerConfig = require('bower-config');
var Configstore = require('configstore');

var current;

function defaultConfig(config) {
config = config || {};

return readCachedConfig(config.cwd || process.cwd(), config);
}

function readCachedConfig(cwd, overwrites) {
