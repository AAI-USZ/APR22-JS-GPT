
var assert = require('assert')

var stringify = require('../../common/stringify')

describe('stringify', function () {
if (window && window.Symbol) {


it('should serialize symbols', function () {
assert.deepStrictEqual(stringify(Symbol.for('x')), 'Symbol(x)')
})
}

it('should serialize string', function () {
assert.deepStrictEqual(stringify('aaa'), "'aaa'")
})

it('should serialize booleans', function () {
assert.deepStrictEqual(stringify(true), 'true')
assert.deepStrictEqual(stringify(false), 'false')
})

it('should serialize null and undefined', function () {
assert.deepStrictEqual(stringify(null), 'null')
assert.deepStrictEqual(stringify(), 'undefined')
})

it('should serialize functions', function () {
function abc (a, b, c) { return 'whatever' }
function def (d, e, f) { return 'whatever' }

var abcString = stringify(abc)
var partsAbc = ['function', 'abc', '(a, b, c)', '{ ... }']
var partsDef = ['function', '(d, e, f)', '{ ... }']

partsAbc.forEach(function (part) {
assert(abcString.indexOf(part) > -1)
})

var defString = stringify(def)
partsDef.forEach(function (part) {
assert(defString.indexOf(part) > -1)
})
})



if (window.Proxy) {
it('should serialize proxied functions', function () {
var defProxy = new Proxy(function (d, e, f) { return 'whatever' }, {})
assert.deepStrictEqual(stringify(defProxy), 'function () { ... }')
})
}

it('should serialize arrays', function () {
assert.deepStrictEqual(stringify(['a', 'b', null, true, false]), "['a', 'b', null, true, false]")
})

it('should serialize objects', function () {
var obj

obj = { a: 'a', b: 'b', c: null, d: true, e: false }
assert(stringify(obj).indexOf("{a: 'a', b: 'b', c: null, d: true, e: false}") > -1)

function MyObj () {
this.a = 'a'
}

obj = new MyObj()
assert(stringify(obj).indexOf("{a: 'a'}") > -1)

obj = { constructor: null }
