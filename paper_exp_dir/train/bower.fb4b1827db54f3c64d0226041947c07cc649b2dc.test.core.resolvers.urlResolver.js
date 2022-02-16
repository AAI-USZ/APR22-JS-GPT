var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var path = require('path');
var nock = require('nock');
var Q = require('q');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var cmd = require('../../../lib/util/cmd');
var UrlResolver = require('../../../lib/core/resolvers/UrlResolver');
var Logger = require('../../../lib/core/Logger');
var defaultConfig = require('../../../lib/config');

describe('UrlResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');
var tempDir = path.resolve(__dirname, '../../assets/tmp');
var logger;

before(function (next) {
logger = new Logger();


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function () {
logger.removeAllListeners();
