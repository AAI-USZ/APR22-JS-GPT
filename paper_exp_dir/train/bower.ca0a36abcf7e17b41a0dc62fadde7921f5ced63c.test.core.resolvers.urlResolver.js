var expect = require('expect.js');
var path = require('path');
var fs = require('../../../lib/util/fs');
var nock = require('nock');
var Q = require('q');
var rimraf = require('../../../lib/util/rimraf');
var mkdirp = require('mkdirp');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var UrlResolver = require('../../../lib/core/resolvers/UrlResolver');
var defaultConfig = require('../../../lib/config');

describe('UrlResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var logger;

before(function (next) {
logger = new Logger();


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function () {
logger.removeAllListeners();
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new UrlResolver(decEndpoint, defaultConfig(), logger);
}

describe('.constructor', function () {
it('should guess the name from the URL', function () {
var resolver = create('http://bower.io/foo.txt');
