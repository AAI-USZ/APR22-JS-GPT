
describe 'Express'
describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
end
end

describe '.parseNestedParams()'
it 'should parse nested params hash provided by node'
params = { 'user[name]' : 'tj', 'user[info][email]' : 'tj@vision-media.ca' }
nested = { user : {
name : 'tj',
info : {
email : 'tj@vision-media.ca'
}
}}
Express.parseNestedParams(params).should.eql nested
