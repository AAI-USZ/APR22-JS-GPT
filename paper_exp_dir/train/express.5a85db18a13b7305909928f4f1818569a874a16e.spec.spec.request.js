
describe 'Express'
before_each
reset()
end

describe '#init()'
describe 'when content-type is "application/x-www-form-urlencoded"'
it 'should parse body as urlencoded params'
post('/login', function(){
return this.param('name')
})
var response = post('/login', { body: 'name=tj', headers: { 'content-type': 'application/x-www-form-urlencoded' }})
response.status.should.eql 200
response.body.should.eql 'tj'
end
