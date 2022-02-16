describe 'Express'
before_each
Express.routes = []
end

describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
