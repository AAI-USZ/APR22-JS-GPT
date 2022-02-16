
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

describe '#accepts()'
describe 'when the Accept header is present'
it 'should return true if the mime type is acceptable'
get('/user', function(){ return this.accepts('jpeg').toString() })
get('/user', { headers: { accept: 'image/jpeg' }}).body.should.eql 'true'
end

it 'should return false if the mime type is not present'
get('/user', function(){ return this.accepts('html').toString() })
get('/user', { headers: { accept: 'image/jpeg' }}).body.should.eql 'false'
end
end

describe 'when the Accept header is not present'
it 'should return true'
get('/user', function(){ return this.accepts('jpeg').toString() })
get('/user', { headers: { accept: null }}).body.should.eql 'true'
end
end
end

describe '#halt()'
describe 'when given no arguments'
it 'should respond with 404 Not Found'
get('/user', function(){ this.halt() })
get('/user').status.should.eql 404
get('/user').body.should.include('Not Found')
end
end

describe 'when given a status code'
it 'should respond with that status and its associated default body'
get('/user', function(){ this.halt(400) })
get('/user').status.should.eql 400
get('/user').body.should.include('Bad Request')
end
end

describe 'when given a status code and body'
it 'should respond with the status and its body'
get('/user', function(){ this.halt(400, 'Oh noes!') })
get('/user').status.should.eql 400
get('/user').body.should.include('Oh noes!')
end
end

describe 'when given an invalid status code'
it 'should throw an InvalidStatusCode exception'

get('/user', function(){ this.halt(123123) })
try { get('/user') }
catch (e) {
e.should.be_an_instance_of ExpressError
e.should.be_an_instance_of InvalidStatusCode
}
end
end
end

describe '#contentType()'
it 'should set Content-Type header with mime type passed'
get('/style.css', function(){
