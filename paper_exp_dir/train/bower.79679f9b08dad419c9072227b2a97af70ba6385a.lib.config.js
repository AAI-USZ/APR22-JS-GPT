var tty = require('tty');
var object = require('mout').object;
var bowerConfig = require('bower-config');
var Configstore = require('configstore');

var cachedConfigs = {};

function defaultConfig(config) {
config = config || {};

var cachedConfig = readCachedConfig(config.cwd || process.cwd());

return object.merge(cachedConfig, config);
}

function readCachedConfig(cwd) {
