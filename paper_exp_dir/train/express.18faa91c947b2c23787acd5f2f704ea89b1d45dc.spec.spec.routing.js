
describe 'Express'
before_each
reset()
end

describe 'param()'
describe 'given no args'
it 'should throw an error'
-{ param() }.should.throw_error TypeError
end
end

describe 'given a non-string as the first argument'
it 'should throw an error'
-{ param(12) }.should.throw_error TypeError
end
end

describe 'given no callback function'
it 'should throw an error'
-{ param('foo') }.should.throw_error TypeError
end
end

describe 'given a non-function as the second argument'
it 'should throw an error'
-{ param('foo', 2) }.should.throw_error TypeError
end
end

describe 'with key / callback function'
it 'should pre-process a value before it is passed to a route'
param('user_id', function(val){
val = parseInt(val)
return isNaN(val) ? false : val
})
get('/user/:user_id', function(id){
return String(typeof id === 'number')
})
get('/user/99').body.should.eql 'true'
end

it 'should pass when false is explictly returned'
param('user_id', function(val){
val = parseInt(val)
return isNaN(val) ? false : val
})
