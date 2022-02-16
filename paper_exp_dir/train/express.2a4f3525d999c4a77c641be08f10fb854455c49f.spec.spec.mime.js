
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
