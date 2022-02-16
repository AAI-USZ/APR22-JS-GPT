
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
