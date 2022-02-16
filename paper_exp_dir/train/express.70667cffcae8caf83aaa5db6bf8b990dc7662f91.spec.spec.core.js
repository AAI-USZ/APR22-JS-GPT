
describe 'Express'
describe '.version'
it 'should be properly formatted'
Express.version.should.match(/^\d+\.\d+\.\d+$/)
end
end

describe 'set()'
it 'should set an option'
set('raise exceptions').should.be_null
set('raise exceptions', true)
set('raise exceptions').should.be_true
end

it 'should defer using a function'
set('root', 'spec')
set('views', function(){ set('root') + '/views' })
set('views').should.eql 'spec/views'
end
end

describe 'enable()'
it 'should enable an option'
enable('sessions')
