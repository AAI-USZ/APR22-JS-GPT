var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var Q = require('q');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var GitFsResolver = require('../../../lib/resolve/resolvers/GitFsResolver');

describe('GitFsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package'),
tempSource;

function clearResolverRuntimeCache() {
GitFsResolver.clearRuntimeCache();
}

afterEach(function (next) {
if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = new GitFsResolver(testPackage);

expect(resolver.getName()).to.equal('github-test-package');
});

it('should not guess the name from the path if the name was specified', function () {
var resolver = new GitFsResolver(testPackage, { name: 'foo' });

expect(resolver.getName()).to.equal('foo');
});

it('should make paths absolute and normalized', function () {
var resolver;

resolver = new GitFsResolver(path.relative(process.cwd(), testPackage));
expect(resolver.getSource()).to.equal(testPackage);

resolver = new GitFsResolver(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});

it.skip('should use config.cwd for resolving relative paths', function () {
});
});

describe('.resolve', function () {
it('should checkout correctly if resolution is a branch', function (next) {
var resolver = new GitFsResolver(testPackage, { target: 'some-branch' });

resolver.resolve()
