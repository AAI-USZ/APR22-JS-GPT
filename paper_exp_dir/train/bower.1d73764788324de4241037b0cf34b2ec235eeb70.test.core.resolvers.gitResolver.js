var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('../../../lib/util/fs');
var chmodr = require('chmodr');
var rimraf = require('../../../lib/util/rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var mout = require('mout');
var Logger = require('bower-logger');
var copy = require('../../../lib/util/copy');
var GitResolver = require('../../../lib/core/resolvers/GitResolver');
var defaultConfig = require('../../../lib/config');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var originalrefs = GitResolver.refs;
var originalEnv = process.env;
var logger;

before(function () {
logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
process.env = originalEnv;
