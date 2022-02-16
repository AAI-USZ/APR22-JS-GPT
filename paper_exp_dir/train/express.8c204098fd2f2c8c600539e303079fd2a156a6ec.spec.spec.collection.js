
process.mixin(require('express/collection'))

describe 'Express'
describe 'Collection'
describe '$(array)'
it 'should return a Collection'
$(['foo', 'bar']).should.be_an_instance_of Collection
end
end

describe '$(object)'
it 'should return a Collection'
$({ foo: 'bar' }).should.be_an_instance_of Collection
end
end

describe '$(Collection)'
it 'should return the collection passed'
var collection = $(['foo'])
$(collection).should.equal collection
end
end

describe '#at()'
it 'should return the value at the given index'
$(['foo', 'bar']).at(0).should.eql 'foo'
$(['foo', 'bar']).at(1).should.eql 'bar'
$(['foo', 'bar']).at(2).should.be_null
end

it 'should work with objects'
$({ foo: 'bar', baz: 'raz' }).at(0).should.eql 'bar'
$({ foo: 'bar', baz: 'raz' }).at(1).should.eql 'raz'
$({ foo: 'bar', baz: 'raz' }).at(2).should.be_null
end
end

describe '#each()'
it 'should iterate passing index and value'
var result = []
$(['foo', 'bar']).each(function(val, i){
result.push(i, val)
})
result.should.eql [0, 'foo', 1, 'bar']
end

it 'should work with objects'
var result = []
$({ foo: 'bar', baz: 'raz' }).each(function(val, key){
result.push(key, val)
})
result.should.eql ['foo', 'bar', 'baz', 'raz']
end

it 'should return the collection'
$([]).each(function(){}).should.be_an_instance_of Collection
end
end

describe '#reduce()'
it 'should iterate with memo object'
var sum = $([1,2,3]).reduce(0, function(sum, n){ return sum + n })
sum.should.eql 6
end

it 'should allow shorthand expressions'
$([1,2,3]).reduce(0, '+').should.eql 6
$([1,2,3]).reduce(0, 'a + b').should.eql 6
end
end

describe '#map()'
it 'should iterate collecting results into a new collection'
var collection = $(['foo', 'bar']).map(function(val){ return val.toUpperCase() })
collection.at(0).should.eql 'FOO'
collection.at(1).should.eql 'BAR'
end

it 'should work with objects'
var collection = $({ foo: 'bar', baz: 'raz' }).map(function(val){ return val.toUpperCase() })
collection.at(0).should.eql 'BAR'
collection.at(1).should.eql 'RAZ'
end

it 'should allow shorthand expressions'
$(['foo', 'bar']).map('a.toUpperCase()').toArray().should.eql ['FOO', 'BAR']
end
end

describe '#first()'
it 'should return the first value'
$(['foo']).first().should.eql 'foo'
end

it 'should return the first n values'
$([5,4,3,2,1]).first(2).at(0).should.eql 5
$([5,4,3,2,1]).first(2).at(1).should.eql 4
end

it 'should work with objects'
$({ foo: 'bar' }).first().should.eql 'bar'
end
end

describe '#last()'
it 'should return the last value'
$(['foo', 'bar']).last().should.eql 'bar'
end

it 'should return the last n values'
$([5,4,3,2,1]).last(2).at(0).should.eql 2
$([5,4,3,2,1]).last(2).at(1).should.eql 1
end

it 'should work with objects'
$({ a: 'foo', b: 'bar' }).last(2).at(0).should.eql 'foo'
$({ a: 'foo', b: 'bar' }).last(2).at(1).should.eql 'bar'
$({ a: 'foo', b: 'bar' }).last().should.eql 'bar'
end
end

describe '#drop()'
it 'should drop the first n values'
$(1..5).drop(2).arr.should.eql 3..5
end
end

describe '#find()'
it 'should return the value of the first match'
var result = $(['foo', 'bar']).find(function(val){ return val.charAt(0) == 'b' })
result.should.eql 'bar'
end

it 'should return null when nothing matches'
var result = $(['foo', 'bar']).find(function(val){ return val.charAt(0) == 'a' })
result.should.be_null
end

it 'should work with objects'
var result = $({ foo: 'bar', baz: 'raz' }).find(function(val, key){
return val.charAt(0) == 'r'
})
result.should.eql 'raz'
end

it 'should allow shorthand expressions'
$(['foo', 'bar']).find("a.charAt(0) == 'b'").should.eql 'bar'
end
end

describe '#all()'
it 'should return true when all evaluate to true'
$(['foo', 'foobar']).all(function(val){ return val.charAt(0) == 'f' }).should.be_true
end

it 'should return false when any evaluate to false'
$(['foo', 'bar', 'foobar']).all(function(val){ return val.charAt(0) == 'f' }).should.be_false
end

it 'should work with objects'
$({ a: 'foo', b: 'foobar' }).all(function(val){ return val.charAt(0) == 'f' }).should.be_true
end

it 'should allow shorthand expressions'
$(['foo', 'bar']).all('a.length > 2').should.be_true
end
end

describe '#any()'
it 'should return true when found'
$(['foo', 'bar']).any(function(val){ return val.charAt(0) == 'b' }).should.be_true
end

it 'should return false when not found'
