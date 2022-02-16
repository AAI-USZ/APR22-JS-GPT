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
});

function clearResolverRuntimeCache() {
GitResolver.refs = originalrefs;
GitResolver.clearRuntimeCache();
}

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitResolver(decEndpoint, defaultConfig(), logger);
}

describe('misc', function () {
it.skip('should error out if git is not installed');
it.skip('should setup git template dir to an empty folder');
it('should set process.env.GIT_SSL_NO_VERIFY when strictSSL is false', function () {
var resolver;
var decEndpoint = { source: 'foo'};

expect(process.env).to.not.have.property('GIT_SSL_NO_VERIFY');

resolver = new GitResolver(decEndpoint, defaultConfig(), logger);
expect(process.env).to.have.property('GIT_SSL_NO_VERIFY','false');
delete process.env.GIT_SSL_NO_VERIFY;

resolver = new GitResolver(decEndpoint, defaultConfig({strictSsl: false}), logger);
expect(process.env).to.have.property('GIT_SSL_NO_VERIFY','true');
delete process.env.GIT_SSL_NO_VERIFY;

resolver = new GitResolver(decEndpoint, defaultConfig({strictSsl: true}), logger);
expect(process.env).to.have.property('GIT_SSL_NO_VERIFY','false');
delete process.env.GIT_SSL_NO_VERIFY;
});
});
