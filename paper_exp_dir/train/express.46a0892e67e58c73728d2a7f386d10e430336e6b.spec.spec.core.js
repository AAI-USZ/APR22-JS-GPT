
describe 'Express'
describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
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
