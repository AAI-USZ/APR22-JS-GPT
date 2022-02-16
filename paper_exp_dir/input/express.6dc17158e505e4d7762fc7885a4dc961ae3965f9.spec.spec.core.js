
describe 'Express'
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
cookie = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; q=foo%3dbar; domain=example.net'
parts = Express.parseCookie(cookie)
parts.expires.should.eql 'Fri, 31-Dec-2010 23:59:59 GMT'
parts.path.should.eql '/'
parts.q.should.eql 'foo=bar'
parts.domain.should.eql 'example.net'
end
end

describe '.cookie()'
before_each
cookie = 'path=/; q=foo%3dbar; domain=.example.net'
Express.response.cookie = Express.parseCookie(cookie)
end

it 'should return cookie value when key passed'
Express.cookie('path').should.eql '/'
Express.cookie('domain').should.eql '.example.net'
end

it 'should set response cookies when value passed'
Express.cookie('foo', 'bar')
Express.cookie('foo').should.eql 'bar'
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

describe '.escape()'
it 'should escape html'
Express.escape('<>&""').should.eql '&lt;&gt;&amp;&quot;&quot;'
end
end

describe '.escapeRegexp()'
it 'should escape regexp special characters'
Express.escapeRegexp('/users/(name)').should.eql '\\/users\\/\\(name\\)'
end

it 'should accept a string of space-delimited characters'
Express.escapeRegexp('/foo/#bar?user[name]=tj', '/ [ ]').should.eql '\\/foo\\/#bar?user\\[name\\]=tj'
end
end

describe '.contentsOf()'
it 'should return the body of a function as a string'
Express.contentsOf(function(){ return 'foo' }).should.include 'return', 'foo'
end
end

describe '.header()'
it 'should set / get headers'
Express.request = {}
Express.header('Content-Type', 'text/html')
Express.header('Content-Type').should.eql 'text/html'
Express.header('Accept').should.eql 'text/plain'
end
