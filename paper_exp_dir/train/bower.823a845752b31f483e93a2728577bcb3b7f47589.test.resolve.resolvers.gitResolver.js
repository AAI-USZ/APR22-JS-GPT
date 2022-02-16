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
delete GitResolver._heads;
delete GitResolver._refs;
}

describe('.hasNew', function () {
beforeEach(function (next) {
cleanInternalResolverCache();
mkdirp(tempDir, next);
});

afterEach(function (next) {
rimraf(tempDir, next);
});

it('should be true when the resolution type is different', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0',
_resolution: {
type: 'tag',
tag: '0.0.0',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
}
}));
GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = new GitResolver('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a higher version for a range is available', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
