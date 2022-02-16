
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
end
end

describe 'dirname()'
it 'should return the directory path'
dirname('/path/to/images/foo.bar.png').should.eql '/path/to/images'
end
end

describe 'halt()'
describe 'when given no arguments'
it 'should respond with 404 Not Found'
get('/user', function(){ halt() })
get('/user').body.should.include('Not Found')
get('/user').status.should.eql 404
end
end

describe 'when given a status code'
it 'should respond with that status and its associated default body'
get('/user', function(){ halt(400) })
get('/user').body.should.include('Bad Request')
get('/user').status.should.eql 400
end
end

describe 'when given a status code and body'
it 'should respond with the status and its body'
get('/user', function(){ halt(400, 'Oh noes!') })
get('/user').body.should.include('Oh noes!')
get('/user').status.should.eql 400
end
end

describe 'when given an invalid status code'
it 'should throw an InvalidStatusCode exception'

get('/user', function(){ halt(123123) })
-{ get('/user') }.should.throw_error(/InvalidStatusCode: 123123/)
try { get('/user') }
catch (e) {
e.should.be_an_instance_of ExpressError
e.should.be_an_instance_of InvalidStatusCode
}
end
end
