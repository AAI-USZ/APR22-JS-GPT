var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var GitRemoteResolver = require('../../../lib/resolve/resolvers/GitRemoteResolver');
var fetchBranch = require('../../util/fetchBranch');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function cleanInternalResolverCache() {
delete GitRemoteResolver._versions;
delete GitRemoteResolver._heads;
delete GitRemoteResolver._refs;
}

before(function (next) {


return fetchBranch('some-branch', testPackage)
.then(next.bind(next, null))
.done();
});

