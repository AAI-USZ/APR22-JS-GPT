var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
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


