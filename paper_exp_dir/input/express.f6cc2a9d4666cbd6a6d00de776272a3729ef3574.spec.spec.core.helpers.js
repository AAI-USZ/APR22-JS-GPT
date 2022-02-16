
describe 'Express'
before_each
reset()
end

describe 'parseParams()'
it 'should parse simple query string key / value pairs'
parseParams('foo=bar').should.eql { foo: 'bar' }
parseParams('foo=bar&baz=1').should.eql { foo: 'bar', baz: '1' }
end

it 'should parse named nested params'
var user = { user: { name: 'tj', email: 'tj@vision-media.ca' }}
parseParams('user[name]=tj&user[email]=tj@vision-media.ca').should.eql user
end

it 'should parse several levels of nesting'
var user = { user: { name: 'tj', email: { primary: 'tj@vision-media.ca' }}}
parseParams('user[name]=tj&user[email][primary]=tj@vision-media.ca').should.eql user
end
