var mout = require('mout');
var Logger = require('bower-logger');
var PackageRepository = require('../core/PackageRepository');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function info(pkg, property, config) {
var repository;
var logger = new Logger();

