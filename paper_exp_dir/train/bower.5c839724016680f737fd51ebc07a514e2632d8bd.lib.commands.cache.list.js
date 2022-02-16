var mout = require('mout');
var PackageRepository = require('../../core/PackageRepository');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function list(logger, packages, options, config) {
var repository;

config = mout.object.deepFillIn(config || {}, defaultConfig);
repository = new PackageRepository(config, logger);

