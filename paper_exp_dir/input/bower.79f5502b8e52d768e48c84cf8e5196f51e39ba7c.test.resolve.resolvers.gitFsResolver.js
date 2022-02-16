var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var path = require('path');
var GitFsResolver = require('../../../lib/resolve/resolvers/GitFsResolver');

describe('GitFsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function cleanInternalResolverCache() {
delete GitFsResolver._versions;
delete GitFsResolver._heads;
delete GitFsResolver._refs;
}

