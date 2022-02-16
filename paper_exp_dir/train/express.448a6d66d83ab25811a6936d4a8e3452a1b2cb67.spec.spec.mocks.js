
describe 'Express'
describe 'Mocks'
describe 'mockRequest()'
it 'should return a mock request'
mockRequest().method.should.eql 'GET'
end

it 'should merge hash passed'
mockRequest({ method : 'POST' }).method.should.eql 'POST'
end
end

