
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

describe 'shorthand expressions'
describe 'with 3 or less chars'
it 'should be considered binary operator between a / b'
$(5..1).sort('-').toArray().should.eql 1..5
$(5..1).reduce(0, '+').should.eql 15
end
end

describe 'with over 3 chars'
it 'should be considered a return expression'
$(5..1).sort('a - b').toArray().should.eql 1..5
