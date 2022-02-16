
var chai = require('chai')
var expect = chai.expect

var stringify = require('../../client/stringify')

describe('stringify', function () {
it('should serialize string', function () {
expect(stringify('aaa')).to.be.eql("'aaa'")
})

it('should serialize booleans', function () {
expect(stringify(true)).to.be.eql('true')
expect(stringify(false)).to.be.eql('false')
})

it('should serialize null and undefined', function () {
expect(stringify(null)).to.be.eql('null')
expect(stringify()).to.be.eql('undefined')
})

it('should serialize functions', function () {
function abc (a, b, c) { return 'whatever' }
var def = function (d, e, f) { return 'whatever' }

var abcString = stringify(abc)
var partsAbc = ['function', 'abc', '(a, b, c)', '{ ... }']
var partsDef = ['function', '(d, e, f)', '{ ... }']

partsAbc.forEach(function (part) {
expect(abcString).to.contain(part)
})

var defString = stringify(def)
partsDef.forEach(function (part) {
expect(defString).to.contain(part)
})
})
