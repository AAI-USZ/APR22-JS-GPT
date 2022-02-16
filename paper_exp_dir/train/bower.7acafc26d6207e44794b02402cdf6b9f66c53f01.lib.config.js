var tty = require('tty');
var object = require('mout').object;
var bowerConfig = require('bower-config');
var Configstore = require('configstore');
var findup = require('findup-sync');
var path = require('path');

var cachedConfigs = {};

function defaultConfig(config) {
config = config || {};

var cwd = path.dirname(findup('bower.json', {
cwd: config.cwd || process.cwd()
})) || config.cwd || process.cwd();

