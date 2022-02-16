var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Q = require('q');
var promptly = require('promptly');
var RegistryClient = require('bower-registry-client');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function register(name, url, config) {
var repository;
var registryClient;
var emitter = new EventEmitter();
var logger = new Logger();
var force;

config = mout.object.deepMixIn(config || {}, defaultConfig);
force = config.force;


config.offline = false;
config.force = true;

name = name.trim();



if (!name) {
process.nextTick(function () {
emitter.emit('error', createError('Please type a name', 'EINVNAME'));
});

return emitter;
}
