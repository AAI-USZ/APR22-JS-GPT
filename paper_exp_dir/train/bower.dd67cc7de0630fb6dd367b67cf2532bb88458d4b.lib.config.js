var tty = require('tty');
var object = require('mout').object;
var bowerConfig = require('bower-config');
var Configstore = require('configstore');
var findup = require('findup-sync');
var path = require('path');

var cachedConfigs = {};

function defaultConfig(config) {
config = config || {};

var cwd = config.cwd || path.dirname(findup('bower.json', {
cwd: process.cwd()
})) || process.cwd();

config.cwd = cwd;

var cachedConfig = readCachedConfig(cwd);

return object.merge(cachedConfig, config);
}

function readCachedConfig(cwd) {
if (cachedConfigs[cwd]) {
return cachedConfigs[cwd];
}

var config = cachedConfigs[cwd] = bowerConfig.read(cwd);
var configstore = new Configstore('bower-github').all;

object.mixIn(config, configstore);



delete config.json;


if (config.interactive == null) {
config.interactive = (
process.bin === 'bower' &&
tty.isatty(1) &&
!process.env.CI
);
}


if (process.bin === 'bower') {
var cli = require('./util/cli');

object.mixIn(config, cli.readOptions({
force: { type: Boolean, shorthand: 'f' },
offline: { type: Boolean, shorthand: 'o' },
verbose: { type: Boolean, shorthand: 'V' },
quiet: { type: Boolean, shorthand: 'q' },
loglevel: { type: String, shorthand: 'l' },
json: { type: Boolean, shorthand: 'j' },
silent: { type: Boolean, shorthand: 's' }
}));
}

return config;
}

function resetCache () {
cachedConfigs = {};
}

module.exports = defaultConfig;
module.exports.reset = resetCache;
