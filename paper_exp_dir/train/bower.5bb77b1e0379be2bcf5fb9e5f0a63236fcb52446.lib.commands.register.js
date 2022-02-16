var mout = require('mout');
var Q = require('q');
var chalk = require('chalk');
var PackageRepository = require('../core/PackageRepository');
var Config = require('bower-config');
var Tracker = require('../util/analytics').Tracker;
var createError = require('../util/createError');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');

function register(logger, name, url, config) {
var repository;
var registryClient;
var tracker;
var force;

