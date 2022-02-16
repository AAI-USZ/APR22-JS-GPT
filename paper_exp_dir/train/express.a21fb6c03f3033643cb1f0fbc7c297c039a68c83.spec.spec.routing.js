
describe 'Express'
describe 'routing'
describe '.routeFunctionFor()'
it 'should return a routing function'
Express.routes = []
foo = Express.routeFunctionFor('get')
foo('/some/path', function(){ return 'body' })
foo('/something/else', function(){ return 'body' })
Express.routes.should.have_length 2
end
end

describe '.normalizePath()'
it 'should strip leading / trailing slashes'
Express.normalizePath('/foo/bar/').should.eql 'foo/bar'
end

it 'should strip leading / trailing whitespace'
