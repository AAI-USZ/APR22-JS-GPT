var expect = require('expect.js');
var fs = require('graceful-fs');
var path = require('path');
var util = require('util');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var Q = require('q');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var Resolver = require('../../../lib/core/resolvers/Resolver');
var Logger = require('../../../lib/core/Logger');
var defaultConfig = require('../../../lib/config');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp');
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');
var logger;

before(function () {
logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
});

function create(decEndpoint, config) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
