
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
Express.normalizePath('  /foo/').should.eql 'foo'
end
end

describe '.routeProvides()'
it 'should match a route providing the correct encoding'
route = { options : {}}
request = { headers : { 'Accept' : 'text/html' }}
Express.routeProvides(route, request).should.be_true
route = { options : { provides : 'text/html' }}
request = { headers : { 'Accept' : 'application/javascript,text/html,text/plain' }}
Express.routeProvides(route, request).should.be_true
request.headers['Accept'] = 'text/plain'
Express.routeProvides(route, request).should.be_false
