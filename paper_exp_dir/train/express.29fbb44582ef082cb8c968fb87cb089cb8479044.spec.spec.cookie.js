
use(Express.Cookie)

describe 'Express'
describe 'Cookie'
before_each
Express.routes = []
end

describe 'settings'
it 'should maxAge'
Express.settings.cookie.maxAge.should.be_a Number
end
end

describe 'onRequest'
it 'should parse cookie fields'
get('foo', function() {
utilities.cookie('q')
})
response = get('foo', { headers : [['Cookie', 'path=/; q=something; domain=.example.net']] })
response.body.should.eql 'something'
end
end

describe 'utilities'
describe 'cookie()'
