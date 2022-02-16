var path = require('path');
var nock = require('nock');
var fs = require('graceful-fs');
var expect = require('expect.js');
var Logger = require('../../../lib/core/Logger');
var GitRemoteResolver  = require('../../../lib/core/resolvers/GitRemoteResolver');
var GitHubResolver = require('../../../lib/core/resolvers/GitHubResolver');
var defaultConfig = require('../../../lib/config');

describe('GitHub', function () {
var logger;
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

before(function () {
logger = new Logger();
