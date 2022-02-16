
describe 'Express'
describe 'StaticFile'
before
StaticFile = require('express/plugins/static').File
use(require('express/plugins/static').Static, { path: 'spec/fixtures' })
end

describe '#constructor'
it 'should accept and assign #path'
(new StaticFile('/foo/bar')).path.should.eql '/foo/bar'
end

it 'should throw an InvalidPathError when .. is found'

try { new StaticFile('/../foobar') }
catch (e) {
e.name.should.eql 'InvalidPathError'
e.message.should.eql "`/../foobar' is not a valid path"
}
end
end

describe 'GET /public/*'
it 'should transfer static files'
get('/public/user.json').body.should.include '"name":'
end
end

describe '#sendfile()'
describe 'when the file exists'
it 'should transfer the file'
