
describe 'Express'
describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
end
end

describe '.escape()'
it 'should escape html'
Express.escape('<>&""').should.eql '&lt;&gt;&amp;&quot;&quot;'
end
end

describe '.normalizePath()'
it 'should strip leading / trailing slashes'
Express.normalizePath('/foo/bar/').should.eql 'foo/bar'
end

