var path = require('path');
var expect = require('expect.js');
var relativeToBaseDir = require('../../lib/util/relativeToBaseDir');

describe('relativeToBaseDir', function () {

var joinOrReturnAbsolutePath = relativeToBaseDir('/tmp');

expect(joinOrReturnAbsolutePath('foo')).to.be.equal(path.resolve('/tmp/foo'));
expect(joinOrReturnAbsolutePath('./foo')).to.be.equal(path.resolve('/tmp/foo'));
});

expect(joinOrReturnAbsolutePath('/foo')).to.be.equal(path.resolve('/foo'));
expect(joinOrReturnAbsolutePath('/foo/bar')).to.be.equal(path.resolve('/foo/bar'));
});
});
