var expect = require('expect.js');
var fs = require('graceful-fs');
var path = require('path');
var mkdirp = require('mkdirp');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var resolverFactory = require('../../lib/core/resolverFactory');
var resolvers = require('../../lib/core/resolvers');
var defaultConfig = require('../../lib/config');
var Logger = require('../../lib/core/Logger');

describe('resolveFactory', function () {
var tempSource;
var logger = new Logger();
var registryClient = new RegistryClient(mout.object.fillIn({
cache: defaultConfig._registry
}, defaultConfig));
