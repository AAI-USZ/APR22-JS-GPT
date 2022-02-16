var chalk = require('chalk');
var Q = require('q');

var defaultConfig = require('../config');
var PackageRepository = require('../core/PackageRepository');
var createError = require('../util/createError');

function unregister(logger, name, config) {
