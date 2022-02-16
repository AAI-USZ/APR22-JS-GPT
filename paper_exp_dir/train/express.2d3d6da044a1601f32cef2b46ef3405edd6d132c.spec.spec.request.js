
describe 'Express'
before_each
reset()
end

describe 'status()'
it 'should set the response status'
get('/user', function(){ this.status(500) })
get('/user').status.should.eql 500
end
end

describe 'header()'
describe 'when given a field name and value'
it 'should set the header'
get('/user', function(){
