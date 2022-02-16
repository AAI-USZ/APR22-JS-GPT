
describe 'Express'
before_each
reset()
end

describe 'mime()'
describe 'when given an extension with leading dot'
it 'should return the associated mime type'
mime('.png').should.eql 'image/png'
end
end
