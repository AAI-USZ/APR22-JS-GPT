
describe 'Express'
before_each
reset()
end

describe 'dirname()'
it 'should return the directory path'
dirname('/path/to/images/foo.bar.png').should.eql '/path/to/images'
end
end

describe 'param()'
it 'should return a route placeholder value'
get('/user/:id', function(){
return 'user ' + param('id')
})
get('/user/12').body.should.eql 'user 12'
