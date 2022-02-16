
describe 'Express'
before_each
reset()
end

describe 'View'
describe 'set("views")'
it 'should default to <root>/views'
set('root', 'spec')
set('views').should.eql 'spec/views'
end
end

describe 'set("partials")'
it 'should default to <root>/views/partials'
set('root', 'spec')
set('partials').should.eql 'spec/views/partials'
end
end

describe '#partial()'
before_each
set('views', 'spec/fixtures')
