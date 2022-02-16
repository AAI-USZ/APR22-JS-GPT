
describe 'Express'
before
utils = require('express/utils')
end

describe 'toArray()'
describe 'when given an array'
it 'should return the array'
utils.toArray([1,2,3]).should.eql [1,2,3]
end
end
