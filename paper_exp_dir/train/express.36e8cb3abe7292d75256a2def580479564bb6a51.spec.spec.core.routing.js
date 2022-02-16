
describe 'Express'
describe 'route'
before
reset()
method = 'get'
end

describe 'with callback function'
it 'should respond with a body string'
GLOBAL[method]('/user', function(){
return 'test'
})
GLOBAL[method]('/user').body.should.eql 'test'
