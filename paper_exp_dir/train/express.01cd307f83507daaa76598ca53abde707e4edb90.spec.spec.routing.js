
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
return 'test with options'
})
get('/user').body.should.eql 'test with options'
end
end

describe 'with a trailing whitespace in request path'
it 'should still match'
get('/user', {}, function(){
return 'test with options'
})
get('/user/   ').body.should.eql 'test with options'
end
end

describe 'with a trailing whitespace in route path'
it 'should still match'
get('/user/   ', {}, function(){
return 'test with options'
})
get('/user').body.should.eql 'test with options'
end
end

describe 'with several similar routes'
it 'should match them properly'
get('/foo', function(){
return 'bar'
})
get('/foos', function(){
return 'baz'
})
get('/foo').body.should.eql 'bar'
get('/foos').body.should.eql 'baz'
end
end

describe 'with several identical routes'
it 'should match the first route'
get('/foo', function(){
return 'bar'
})
get('/foo', function(){
return 'baz'
})
get('/foo').body.should.eql 'bar'
end
end

describe 'with no response body'
it 'should throw a InvalidResponseBody'
get('/user', function(){
this.respond()
})
-{ get('/user') }.should.throw_error(/InvalidResponseBody: get "\/user" did not respond with a body string/)
end
end

describe 'with a wild-card'
it 'should still match'
get('/user/:id', function(){ return 'yay' })
get('/user/12').body.should.eql 'yay'
end

it 'should not match with an additional path segment'
get('/user/:id', function(){ return 'yay' })
get('/user/12/edit').body.should.eql 'Not Found'
end

it 'should pass it to the route function'
get('/user/:id', function(id){
return id
})
get('/user/12').body.should.eql '12'
end
end

describe 'with several wild-cards'
it 'should still match'
get('/user/:id/:op', function(){ return 'yay' })
get('/user/12/edit').body.should.eql 'yay'
end

it 'should pass them to the route function'
get('/user/:id/:op', function(id, op){
return op + 'ing user ' + id
})
get('/user/12/edit').body.should.eql 'editing user 12'
end
end

describe 'with an optional wild-card'
it 'should match with a value'
get('/user/:id?', function(){ return 'yay' })
get('/user/1').body.should.eql 'yay'
end

it 'should pass it to the route function'
get('/user/:id?', function(id){
return id || 'You'
})
get('/user/12').body.should.eql '12'
get('/user').body.should.eql 'You'
end

it 'should match without a value'
get('/user/:id?', function(){ return 'yay' })
get('/user').body.should.eql 'yay'
end

it 'should not match with an additional path segment'
get('/user/:id?', function(){ return 'yay' })
get('/user/12/edit').body.should.eql 'Not Found'
end

it 'should match without leading character'
get('/report.:format?', function(format){ return format || 'none' })
get('/report.csv').body.should.eql 'csv'
get('/report').body.should.eql 'none'
end

end

describe 'with partial wild-card'
