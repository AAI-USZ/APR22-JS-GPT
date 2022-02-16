
var assert = require('assert')

var stringify = require('../../common/stringify')

describe('stringify', function () {
if (window && window.Symbol) {


it('should serialize symbols', function () {
assert.deepEqual(stringify(Symbol.for('x')), 'Symbol(x)')
})
}

it('should serialize string', function () {
assert.deepEqual(stringify('aaa'), "'aaa'")
})
