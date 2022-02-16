var createError = require('../../../lib/util/createError');
var expect = require('expect.js');

describe('createError', function() {
beforeEach(function() {
this.err = createError('message', 500);
});

describe('requiring the createError module', function() {
it('should expose a createError method', function() {
expect(typeof createError === 'function').to.be.ok;
});
});
