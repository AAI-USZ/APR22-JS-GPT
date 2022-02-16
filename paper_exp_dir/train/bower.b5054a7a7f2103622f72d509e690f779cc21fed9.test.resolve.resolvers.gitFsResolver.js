var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var cmd = require('../../../lib/util/cmd');
var GitFsResolver = require('../../../lib/resolve/resolvers/GitFsResolver');

describe('GitFsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function clearResolverRuntimeCache() {
GitFsResolver.clearRuntimeCache();
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = new GitFsResolver(testPackage);

expect(resolver.getName()).to.equal('github-test-package');
});
