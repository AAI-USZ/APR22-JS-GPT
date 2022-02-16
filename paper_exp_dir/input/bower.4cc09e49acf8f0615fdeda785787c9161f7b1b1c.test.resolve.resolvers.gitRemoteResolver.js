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

