
describe 'Express'
describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
end
end

describe '.parseNestedParams()'
it 'should parse nested params hash provided by node'
params = { 'foo' : 'bar', 'user[name]' : 'tj', 'user[info][email]' : 'tj@vision-media.ca', 'user[info][city]' : 'Victoria' }
nested = {
foo : 'bar',
user : {
name : 'tj',
info : {
email : 'tj@vision-media.ca',
city : 'Victoria'
}
}}
