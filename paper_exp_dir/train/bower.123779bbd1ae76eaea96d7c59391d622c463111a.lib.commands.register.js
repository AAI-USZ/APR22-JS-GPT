var Q = require('q');
var chalk = require('chalk');
var PackageRepository = require('../core/PackageRepository');
var Tracker = require('../util/analytics').Tracker;
var createError = require('../util/createError');
var defaultConfig = require('../config');

function register(logger, name, url, config) {
var repository;
var registryClient;
