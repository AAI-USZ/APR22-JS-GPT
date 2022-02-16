var path = require('path');
var nock = require('nock');
var fs = require('graceful-fs');
var expect = require('expect.js');
var Logger = require('bower-logger');
var GitRemoteResolver  = require('../../../lib/core/resolvers/GitRemoteResolver');
var GitHubResolver = require('../../../lib/core/resolvers/GitHubResolver');
var defaultConfig = require('../../../lib/config');

describe('GitHub', function () {
var logger;
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

before(function () {
logger = new Logger();
});

afterEach(function () {

nock.cleanAll();

logger.removeAllListeners();
});

function create(decEndpoint, config) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitHubResolver(decEndpoint, config || defaultConfig, logger);
}

