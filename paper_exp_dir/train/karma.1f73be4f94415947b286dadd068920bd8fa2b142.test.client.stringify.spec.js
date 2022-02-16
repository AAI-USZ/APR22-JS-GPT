
var chai = require('chai')
var expect = chai.expect

var stringify = require('../../client/stringify')

describe('stringify', function () {
it('should serialize string', function () {
expect(stringify('aaa')).to.be.eql("'aaa'")
})

it('should serialize booleans', function () {
