
describe 'Express'
describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
end
end

describe '.normalizePath()'
it 'should strip leading / trailing slashes'
Express.normalizePath('/foo/bar/').should.eql 'foo/bar'
end

it 'should strip leading / trailing whitespace'
Express.normalizePath('  /foo/').should.eql 'foo'
end
end

describe '.contentsOf()'
