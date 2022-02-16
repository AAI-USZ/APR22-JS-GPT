var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var path = require('path');
var rimraf = require('rimraf');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var GitFsResolver = require('../../../lib/core/resolvers/GitFsResolver');
var Logger = require('../../../lib/core/Logger');
var defaultConfig = require('../../../lib/config');

describe('GitFsResolver', function () {
var tempSource;
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');
var logger;

before(function () {
logger = new Logger();
});

afterEach(function (next) {
logger.removeAllListeners();

if (tempSource) {
rimraf(tempSource, next);
