
describe 'Express'
before_each
reset()
end

describe 'Request'
describe '#status()'
it 'should set the response status'
get('/user', function(){ this.status(500) })
get('/user').status.should.eql 500
end
end

describe '#header()'
describe 'when given a field name and value'
it 'should set the header'
get('/user', function(){
this.header('x-foo', 'bar')
})
get('/user').headers.should.have_property 'x-foo', 'bar'
end
end

describe 'when given a field name'
it 'should return a request header value'
get('/user', function(){
return this.header('host')
})
get('/user').body.should.eql 'localhost'
end

it 'should be case-insensitive'
get('/user', function(){
return this.header('Host')
})
get('/user').body.should.eql 'localhost'
end
end
end

describe '#isXHR'
it 'should return false unless X-Requested-With is "XMLHttpRequest"'
get('/', function(){ return this.isXHR ? 'yay' : 'nope' })
get('/').body.should.eql 'nope'
end

it 'should return true when X-Requested-With is "XMLHttpRequest"'
get('/', function(){ return this.isXHR ? 'yay' : 'nope' })
get('/', { headers: { 'x-requested-with': 'XMLHttpRequest' }}).body.should.eql 'yay'
end
