
describe 'Express'
before_each
reset()
end

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

describe 'extname()'
it 'should return the a files extension'
extname('image.png').should.eql 'png'
extname('image.large.png').should.eql 'png'
extname('/path/to/image.large.png').should.eql 'png'
end

it 'should return null when not found'
extname('path').should.be_null
extname('/just/a/path').should.be_null
