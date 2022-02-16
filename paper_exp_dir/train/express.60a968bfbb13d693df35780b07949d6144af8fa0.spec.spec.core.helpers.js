
describe 'Express'
before_each
reset()
end

describe 'dirname()'
describe 'when given a directory path'
it 'should return the string untouched'
dirname('/some/path').should.eql '/some/path'
end
end

describe 'when given a file path'
it 'should return the directory path'
dirname('/path/to/images/foo.bar.png').should.eql '/path/to/images'
