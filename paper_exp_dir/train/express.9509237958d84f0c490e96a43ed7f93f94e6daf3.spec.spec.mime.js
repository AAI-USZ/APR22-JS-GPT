
describe 'Express'
before
mime = require('express/mime')
end

before_each
reset()
end

describe 'mime'
describe 'type()'
describe 'when given an extension with leading dot'
it 'should return the associated mime type'
mime.type('.png').should.eql 'image/png'
mime.type('.foo.png').should.eql 'image/png'
end
end

describe 'when given an extension without leading dot'
it 'should return the associated mime type'
mime.type('png').should.eql 'image/png'
end
end

describe 'when given a file path'
it 'should return the associated mime type'
