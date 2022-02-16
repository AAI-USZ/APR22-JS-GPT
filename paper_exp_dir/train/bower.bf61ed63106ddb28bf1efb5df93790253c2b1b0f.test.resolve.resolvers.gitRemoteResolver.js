var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var GitRemoteResolver = require('../../../lib/resolve/resolvers/GitRemoteResolver');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function cleanInternalResolverCache() {
delete GitRemoteResolver._versions;
delete GitRemoteResolver._tags;
delete GitRemoteResolver._branches;
delete GitRemoteResolver._refs;
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = new GitRemoteResolver('file://' + testPackage);

expect(resolver.getName()).to.equal('github-test-package');
