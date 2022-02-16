var mout = require('mout');
var Q = require('q');
var chalk = require('chalk');
var PackageRepository = require('../core/PackageRepository');
var Config = require('bower-config');
var Tracker = require('../util/analytics').Tracker;
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');

function register(logger, name, url, config) {
var repository;
var registryClient;
var tracker;
var force;

config = defaultConfig(config);
force = config.force;
tracker = new Tracker(config);

name = (name || '').trim();
url = (url || '').trim();


config.offline = false;
config.force = true;

return Q.try(function () {

if (!name || !url) {
throw createError('Usage: bower register <name> <url>', 'EINVFORMAT');
}



if (config.registry.register === Config.DEFAULT_REGISTRY) {
