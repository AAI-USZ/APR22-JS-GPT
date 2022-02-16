
const assert = require('assert')

const stringify = require('../../common/stringify')

describe('stringify', function () {
if (window && window.Symbol) {


it('should serialize symbols', function () {
assert.deepEqual(stringify(Symbol.for('x')), 'Symbol(x)')
})
}

it('should serialize string', function () {
assert.deepEqual(stringify('aaa'), "'aaa'")
})

it('should serialize booleans', function () {
assert.deepEqual(stringify(true), 'true')
assert.deepEqual(stringify(false), 'false')
})

it('should serialize null and undefined', function () {
assert.deepEqual(stringify(null), 'null')
assert.deepEqual(stringify(), 'undefined')
})

it('should serialize functions', function () {
function abc (a, b, c) { return 'whatever' }
function def (d, e, f) { return 'whatever' }

const abcString = stringify(abc)
const partsAbc = ['function', 'abc', '(a, b, c)', '{ ... }']
const partsDef = ['function', '(d, e, f)', '{ ... }']

partsAbc.forEach(function (part) {
assert(abcString.indexOf(part) > -1)
})

const defString = stringify(def)
partsDef.forEach(function (part) {
assert(defString.indexOf(part) > -1)
})
})



if (window.Proxy) {
it('should serialize proxied functions', function () {
const defProxy = new Proxy(function (d, e, f) { return 'whatever' }, {})
assert.deepEqual(stringify(defProxy), 'function () { ... }')
})
}

it('should serialize arrays', function () {
assert.deepEqual(stringify(['a', 'b', null, true, false]), "['a', 'b', null, true, false]")
})

it('should serialize objects', function () {
let obj

obj = {a: 'a', b: 'b', c: null, d: true, e: false}
assert(stringify(obj).indexOf("{a: 'a', b: 'b', c: null, d: true, e: false}") > -1)

function MyObj () {
this.a = 'a'
}

obj = new MyObj()
assert(stringify(obj).indexOf("{a: 'a'}") > -1)

obj = {constructor: null}


const s = stringify(obj)
assert(s.indexOf('{constructor: null}') > -1 || s.indexOf('Object{}') > -1)

obj = Object.create(null)
obj.a = 'a'

assert(stringify(obj).indexOf("{a: 'a'}") > -1)
})

it('should serialize html', function () {
const div = document.createElement('div')
