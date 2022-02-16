

var stringify = require('../../client/stringify')

describe('stringify', function () {
it('should serialize string', function () {
expect(stringify('aaa')).toBe("'aaa'")
})

it('should serialize booleans', function () {
expect(stringify(true)).toBe('true')
expect(stringify(false)).toBe('false')
