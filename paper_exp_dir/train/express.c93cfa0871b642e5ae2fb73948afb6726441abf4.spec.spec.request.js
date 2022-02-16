
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
