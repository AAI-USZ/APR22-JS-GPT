
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

describe '#partial()'
before_each
set('views', 'spec/fixtures')
end

describe 'given a valid view name'
it 'should render a partial'
get('/', function(){
this.render('list.haml.html', { locals: { items: ['foo', 'bar'] }})
})
get('/').body.should.include '<ul>'
get('/').body.should.include '<li>foo'
get('/').body.should.include '<li>bar'
end

it 'should render collections'
get('/', function(){
return this.partial('item.haml.html', {
collection: ['foo', 'bar']
})
})
get('/').body.should.include '<li>foo'
get('/').body.should.include '<li>bar'
end
