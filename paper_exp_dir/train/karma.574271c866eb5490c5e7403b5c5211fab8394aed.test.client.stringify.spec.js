
var assert = require('assert')

var stringify = require('../../client/stringify')

describe('stringify', function () {
it('should serialize string', function () {
assert.deepEqual(stringify('aaa'), "'aaa'")
})

it('should serialize booleans', function () {
