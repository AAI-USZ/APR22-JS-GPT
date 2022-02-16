
describe 'Express'
describe 'StaticFile'
before
StaticFile = require('express/plugins/static').File
use(require('express/plugins/static').Static)
end

describe '#constructor'
it 'should accept and assign #path'
(new StaticFile('/foo/bar')).path.should.eql '/foo/bar'
end

it 'should throw an InvalidPathError when .. is found'
