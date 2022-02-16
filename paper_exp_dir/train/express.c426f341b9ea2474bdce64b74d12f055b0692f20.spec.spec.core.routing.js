
describe 'Express'
before_each
reset()
end

describe 'route'
describe 'with callback function'
it 'should respond with a body string'
get('/user', function(){
return 'test'
})
get('/user').body.should.eql 'test'
end
end

describe 'with options and callback function'
it 'should respond with a body string'
get('/user', {}, function(){
return 'test with options'
})
get('/user').body.should.eql 'test with options'
end
end

describe 'with a trailing slash in request path'
it 'should still match'
get('/user', {}, function(){
return 'test with options'
})
get('/user/').body.should.eql 'test with options'
end
end

describe 'with a trailing slash in route path'
it 'should still match'
get('/user/', {}, function(){
