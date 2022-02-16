var mout = require('mout');
var Q = require('q');
var chalk = require('chalk');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('bower-logger');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');

function register(name, url, config) {
var repository;
var registryClient;
var logger = new Logger();
var force;

config = mout.object.deepFillIn(config || {}, defaultConfig);
force = config.force;
