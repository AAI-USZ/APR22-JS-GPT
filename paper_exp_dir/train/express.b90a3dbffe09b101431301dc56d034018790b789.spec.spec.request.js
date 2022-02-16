
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

describe '#charset'
describe 'when defined'
it 'should append "; charset=CHARSET'
get('/user', function(){
this.contentType('html')
this.charset = 'UTF-8'
return '∂'
})
get('/user').headers['Content-Type'].should.eql 'text/html; charset=UTF-8'
end
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

it 'should be case insensitive'
get('/', function(){ return this.isXHR ? 'yay' : 'nope' })
get('/', { headers: { 'x-requested-with': 'xmlhttprequest' }}).body.should.eql 'yay'
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
get('/user', { headers: { accept: '' }}).body.should.eql 'true'
end
end

describe 'should allow multiple arguments'
it 'should return true if any mime type is present'
get('/user', function(){ return this.accepts('jpeg', 'png').toString() })
get('/user', { headers: { accept: 'image/gif,image/png' }}).body.should.eql 'true'
end

it 'should return false if none of the mime types are present'
get('/user', function(){ return this.accepts('jpeg', 'png').toString() })
get('/user', { headers: { accept: 'text/plain,text/html' }}).body.should.eql 'false'
end
end

describe 'when a media type range was sent'
it 'should return true if the group media type matches'
get('/user', function(){ return this.accepts('html').toString() })
get('/user', { headers: { accept: 'text/plain,text/*' }}).body.should.eql 'true'
end
it 'should return false if the group media type does not match'
get('/user', function(){ return this.accepts('ogg').toString() })
get('/user', { headers: { accept: 'text/plain,text/*' }}).body.should.eql 'false'
end
end
end

describe '#contentType()'
it 'should set Content-Type header with mime type passed'
get('/style.css', function(){
this.contentType('css')
return 'body { background: white; }'
})
get('/style.css').headers['Content-Type'].should.eql 'text/css'
end
end

describe '#attachment()'
