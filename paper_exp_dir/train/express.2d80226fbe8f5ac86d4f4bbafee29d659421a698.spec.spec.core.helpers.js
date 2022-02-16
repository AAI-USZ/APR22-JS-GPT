
describe 'Express'
before_each
reset()
end

describe 'param()'
it 'should return a route placeholder value'
get('/user/:id', function(){
return 'user ' + param('id')
})
