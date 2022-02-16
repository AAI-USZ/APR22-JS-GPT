
describe 'Express'
before_each
Express.routes = []
end

describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
end
end

describe '.parseNestedParams()'
it 'should parse nested params hash provided by node'
params = { 'foo' : 'bar', 'user[name]' : 'tj', 'user[info][email]' : 'tj@vision-media.ca', 'user[info][city]' : 'Victoria' }
nested = Express.parseNestedParams(params)
nested.foo.should.eql 'bar'
nested.user.name.should.eql 'tj'
nested.user.info.email.should.eql 'tj@vision-media.ca'
nested.user.info.city.should.eql 'Victoria'
end
end

describe '.parseCookie()'
it 'should parse cookie pairs'
var cookie = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; q=foo%3dbar; domain=example.net'
parts = Express.parseCookie(cookie)
parts.expires.should.eql 'Fri, 31-Dec-2010 23:59:59 GMT'
parts.path.should.eql '/'
parts.q.should.eql 'foo=bar'
parts.domain.should.eql 'example.net'
end
end

describe '.argsArray()'
it 'should return an array of arguments'
Express.argsArray(-{ return arguments }('foo', 'bar')).should.eql ['foo', 'bar']
end

it 'should allow an offset'
Express.argsArray(-{ return arguments }('foo', 'bar'), 1).should.eql ['bar']
end
end
