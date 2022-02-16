var expect = require('expect.js');
var Q = require('q');
var GitResolver = require('../../../lib/resolve/resolvers/GitResolver');

describe('GitResolver', function () {
beforeEach(function () {
GitResolver.fetchRefs = function () {};
delete GitResolver._versions;
delete GitResolver._heads;
delete GitResolver._refs;
});

describe('hasNew', function () {
it('should return a promise');
it('should be true when the resolution type is different');
it('should be true when a different tag (higher/lower) for a range is available');
it('should be false when resolved to the same tag for a given range');
it('should be true when a different commit hash for a given branch is available');
it('should be false when resolved to the the same commit hash for a given branch');
it('should be false when targeting commit hashes');
it('should resolve to the master branch when the target is *');
});
