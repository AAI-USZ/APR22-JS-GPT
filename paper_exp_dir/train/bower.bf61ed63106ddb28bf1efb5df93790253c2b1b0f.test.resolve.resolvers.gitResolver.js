var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var ncp = require('ncp');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('../../../lib/resolve/resolvers/GitResolver');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp'),
originalFetchRefs = GitResolver.fetchRefs;

function cleanInternalResolverCache() {
GitResolver.fetchRefs = originalFetchRefs;
delete GitResolver._versions;
delete GitResolver._tags;
delete GitResolver._branches;
delete GitResolver._refs;
}

describe('.hasNew', function () {
beforeEach(function (next) {
mkdirp(tempDir, next);
});

