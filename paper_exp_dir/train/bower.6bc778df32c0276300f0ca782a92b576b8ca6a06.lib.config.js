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
current = bowerConfig.create(cwd).load(overwrites);

var config = current.toObject();

var configstore = new Configstore('bower-github').all;

object.mixIn(config, configstore);


if (config.interactive == null) {
config.interactive =
process.bin === 'bower' && tty.isatty(1) && !process.env.CI;
}


if (process.bin === 'bower') {
var cli = require('./util/cli');

object.mixIn(
config,
cli.readOptions({
