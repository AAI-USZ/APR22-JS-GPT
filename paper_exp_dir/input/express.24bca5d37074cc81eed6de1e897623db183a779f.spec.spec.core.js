
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

