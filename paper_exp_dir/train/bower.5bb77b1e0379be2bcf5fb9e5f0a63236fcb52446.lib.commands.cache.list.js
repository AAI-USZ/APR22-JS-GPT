var mout = require('mout');
var PackageRepository = require('../../core/PackageRepository');
var defaultConfig = require('../../config');

function list(logger, packages, options, config) {
var repository;

config = defaultConfig(config);
repository = new PackageRepository(config, logger);


if (packages && !packages.length) {
packages = null;
