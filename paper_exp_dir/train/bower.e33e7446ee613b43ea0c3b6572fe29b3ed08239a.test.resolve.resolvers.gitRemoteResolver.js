var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var GitRemoteResolver = require('../../../lib/resolve/resolvers/GitRemoteResolver');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function clearResolverRuntimeCache() {
GitRemoteResolver.clearRuntimeCache();
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver;

resolver = new GitRemoteResolver('file://' + testPackage);
expect(resolver.getName()).to.equal('github-test-package');

resolver = new GitRemoteResolver('git://github.com/twitter/bower.git');
expect(resolver.getName()).to.equal('bower');

resolver = new GitRemoteResolver('git://github.com/twitter/bower');
expect(resolver.getName()).to.equal('bower');

resolver = new GitRemoteResolver('git://github.com');
expect(resolver.getName()).to.equal('github.com');
});

it('should ensure .git in the source (except if protocol is file://)', function () {
var resolver;

resolver = new GitRemoteResolver('git://github.com/twitter/bower');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = new GitRemoteResolver('git://github.com/twitter/bower.git');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = new GitRemoteResolver('git://github.com/twitter/bower.git/');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = new GitRemoteResolver('file://' + testPackage);
expect(resolver.getSource()).to.equal('file://' + testPackage);
});
});

describe('.resolve', function () {
it('should checkout correctly if resolution is a branch', function (next) {
