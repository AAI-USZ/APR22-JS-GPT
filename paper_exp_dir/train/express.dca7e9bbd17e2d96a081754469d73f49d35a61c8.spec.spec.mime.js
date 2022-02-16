
describe 'Express'
describe 'Mime'
describe '.mime()'
it 'should return media type of extensions passed'
Express.utilities.mime('jpeg').should.eql 'image/jpeg'
end

it 'should return application/octet-stream when invalid'
Express.utilities.mime('foobar').should.eql 'application/octet-stream'
end
