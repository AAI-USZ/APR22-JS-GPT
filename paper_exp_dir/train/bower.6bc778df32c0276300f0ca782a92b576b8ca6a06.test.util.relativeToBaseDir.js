var path = require('path');
var expect = require('expect.js');
var relativeToBaseDir = require('../../lib/util/relativeToBaseDir');

describe('relativeToBaseDir', function() {
var joinOrReturnAbsolutePath = relativeToBaseDir('/tmp');

it('returns a partial function that joins paths of the partials first arguments', function() {
expect(joinOrReturnAbsolutePath('foo')).to.be.equal(
path.resolve('/tmp/foo')
);
expect(joinOrReturnAbsolutePath('./foo')).to.be.equal(
path.resolve('/tmp/foo')
);
