var expect = require('expect.js');
var Q = require('q');
var path = require('path');
var mout = require('mout');
var fs = require('graceful-fs');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var proxyquire = require('proxyquire');
var defaultConfig = require('../../lib/config');
var Logger = require('../../lib/core/Logger');
var ResolveCache = require('../../lib/core/ResolveCache');
var resolvers = require('../../lib/core/resolvers');
var copy = require('../../lib/util/copy');

describe('PackageRepository', function () {
var packageRepository;
var resolver;
var resolverFactoryHook;
var resolverFactoryClearHook;
var testPackage = path.resolve(__dirname, '../assets/github-test-package');
