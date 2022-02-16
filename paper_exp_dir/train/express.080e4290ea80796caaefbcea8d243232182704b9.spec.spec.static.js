
describe 'Express'
describe 'StaticFile'
before
StaticFile = require('express/static').File
end

describe '#init'
it 'should accept and assign #path'
(new StaticFile('/foo/bar')).path.should.eql '/foo/bar'
end

it 'should throw an InvalidPathError when .. is found'

try { new StaticFile('/../foobar') }
catch (e) {
e.should.be_an_instance_of InvalidPathError
}
