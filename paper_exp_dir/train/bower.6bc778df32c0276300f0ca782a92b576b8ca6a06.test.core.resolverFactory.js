var expect = require('expect.js');
var fs = require('../../lib/util/fs');
var path = require('path');
var mkdirp = require('mkdirp');
var mout = require('mout');
var Q = require('q');
var rimraf = require('../../lib/util/rimraf');
var RegistryClient = require('bower-registry-client');
var Logger = require('bower-logger');
var resolverFactory = require('../../lib/core/resolverFactory');
var resolvers = require('../../lib/core/resolvers');
var defaultConfig = require('../../lib/config');
var helpers = require('../helpers');

describe('resolverFactory', function() {
var tempSource;
var logger = new Logger();
var registryClient = new RegistryClient(
defaultConfig({
cache: defaultConfig()._registry
})
);

afterEach(function(next) {
logger.removeAllListeners();

