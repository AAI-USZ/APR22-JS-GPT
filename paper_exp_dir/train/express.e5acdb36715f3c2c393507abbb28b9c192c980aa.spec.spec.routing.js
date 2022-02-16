
describe 'Express'
describe 'routing'
describe '.routeFunctionFor()'
it 'should return a routing function'
Express.routes = []
foo = Express.routeFunctionFor('get')
foo('/some/path', function(){ return 'body' })
Express.routes.should.have_length 1
end
end

describe '.normalizePath()'
it 'should strip leading / trailing slashes'
Express.normalizePath('/foo/bar/').should.eql 'foo/bar'
end

it 'should strip leading / trailing whitespace'
Express.normalizePath('  /foo/').should.eql 'foo'
end
end

describe '.routeMethod()'
it 'should match route / request methods'
Express.routeMethod({ method : 'get' }, { method : 'GET' }).should.be_true
Express.routeMethod({ method : 'post' }, { method : 'GET' }).should.be_false
end
end

describe '.routeProvides()'
it 'should match a route providing the correct encoding'
route = { options : {}}
