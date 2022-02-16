
describe 'Express'
before_each
Express.routes = []
end

describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
end
end

describe '.parseParams()'
it 'should parse a string of parameters'
string = 'user[name]=tj&user[pass]=test&foo=some bar stuff&cookies=awesome'
params = Express.parseParams(string)
params.user.name.should.eql 'tj'
params.user.pass.should.eql 'test'
params.foo.should.eql 'some bar stuff'
params.cookies.should.eql 'awesome'
end
end

describe '.parseNestedParams()'
it 'should parse nested params hash provided by node'
