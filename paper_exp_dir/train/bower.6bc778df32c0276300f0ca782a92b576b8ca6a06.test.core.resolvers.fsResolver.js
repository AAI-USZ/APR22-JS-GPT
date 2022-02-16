var expect = require('expect.js');
var path = require('path');
var fs = require('../../../lib/util/fs');
var path = require('path');
var rimraf = require('../../../lib/util/rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var FsResolver = require('../../../lib/core/resolvers/FsResolver');
var defaultConfig = require('../../../lib/config');

describe('FsResolver', function() {
var tempSource;
var logger;
var testPackage = path.resolve(__dirname, '../../assets/package-a');

before(function(next) {
logger = new Logger();


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage }).then(
next.bind(next, null),
next
);
});

afterEach(function(next) {
logger.removeAllListeners();
