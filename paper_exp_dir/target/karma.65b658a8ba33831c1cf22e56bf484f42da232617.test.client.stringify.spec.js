it('should serialize symbols', function () {
assert.deepEqual(stringify(Symbol.for('x')), 'Symbol(x)')
it('should serialize string', function () {
