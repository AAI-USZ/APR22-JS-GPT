var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var cmd = require('../../../lib/util/cmd');
var GitRemoteResolver = require('../../../lib/resolve/resolvers/GitRemoteResolver');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function cleanInternalResolverCache() {
