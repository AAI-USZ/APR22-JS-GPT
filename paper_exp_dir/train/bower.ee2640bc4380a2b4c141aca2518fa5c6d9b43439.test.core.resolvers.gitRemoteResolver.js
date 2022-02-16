var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var Logger = require('bower-logger');
var GitRemoteResolver = require('../../../lib/core/resolvers/GitRemoteResolver');
var defaultConfig = require('../../../lib/config');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;

before(function () {
logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
});

function clearResolverRuntimeCache() {
GitRemoteResolver.clearRuntimeCache();
}

function create(decEndpoint, config) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitRemoteResolver(decEndpoint, config || defaultConfig, logger);
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver;

resolver = create('file://' + testPackage);
expect(resolver.getName()).to.equal('package-a');

resolver = create('git://github.com/twitter/bower.git');
expect(resolver.getName()).to.equal('bower');

resolver = create('git://github.com/twitter/bower');
expect(resolver.getName()).to.equal('bower');

resolver = create('git://github.com');
expect(resolver.getName()).to.equal('github.com');
});
});

describe('.resolve', function () {
it('should checkout correctly if resolution is a branch', function (next) {
var resolver = create({ source: 'file://' + testPackage, target: 'some-branch' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);
