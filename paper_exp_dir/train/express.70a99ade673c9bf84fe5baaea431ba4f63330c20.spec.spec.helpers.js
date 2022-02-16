
describe 'Express'
describe 'toArray()'
describe 'when given an array'
it 'should return the array'
toArray([1,2,3]).should.eql [1,2,3]
end
end

describe 'when given an object with indexed values and length'
it 'should return an array'
var args = -{ return arguments }('foo', 'bar')
toArray(args).should.eql ['foo', 'bar']
end
end
end

describe 'escape()'
it 'should escape html'
escape('<p>this & that').should.eql '&lt;p&gt;this &amp; that'
end
end

describe 'uid()'
it 'should return a string of random characters'
uid().should.not.eql uid()
uid().length.should.be_greater_than 20
end
end

describe 'extname()'
it 'should return the a files extension'
extname('image.png').should.eql 'png'
extname('image.large.png').should.eql 'png'
extname('/path/to/image.large.png').should.eql 'png'
end

it 'should return null when not found'
extname('path').should.be_null
extname('/just/a/path').should.be_null
end
end

describe 'basename()'
it 'should return a files basename'
basename('foo/bar/baz.image.png').should.eql 'baz.image.png'
end
end

describe 'mergeParam()'
describe 'with empty params'
it 'should merge the given key and value'
params = {}
mergeParam('user[names][first]', 'tj', params)
params.user.names.first.should.eql 'tj'
end
