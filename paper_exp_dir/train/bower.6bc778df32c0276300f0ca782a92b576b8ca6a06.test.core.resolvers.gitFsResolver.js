var expect = require('expect.js');
var path = require('path');
var fs = require('../../../lib/util/fs');
var path = require('path');
var rimraf = require('../../../lib/util/rimraf');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var GitFsResolver = require('../../../lib/core/resolvers/GitFsResolver');
var defaultConfig = require('../../../lib/config');

describe('GitFsResolver', function() {
var tempSource;
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;

before(function() {
logger = new Logger();
});

afterEach(function(next) {
logger.removeAllListeners();

if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

function clearResolverRuntimeCache() {
GitFsResolver.clearRuntimeCache();
}

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitFsResolver(decEndpoint, defaultConfig(), logger);
}

describe('.constructor', function() {
it('should guess the name from the path', function() {
var resolver = create(testPackage);

expect(resolver.getName()).to.equal('package-a');
});

it('should not guess the name from the path if the name was specified', function() {
var resolver = create({ source: testPackage, name: 'foo' });

expect(resolver.getName()).to.equal('foo');
});

it('should make paths absolute and normalized', function() {
var resolver;

resolver = create(path.relative(process.cwd(), testPackage));
expect(resolver.getSource()).to.equal(testPackage);

resolver = create(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});

it.skip('should use config.cwd for resolving relative paths');
});

describe('.resolve', function() {
it('should checkout correctly if resolution is a branch', function(next) {
var resolver = create({
