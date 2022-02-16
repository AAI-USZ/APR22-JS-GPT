
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
it 'should default to <views>/partials'
set('root', 'spec')
set('partials').should.eql 'spec/views/partials'
set('views', 'magicland')
set('partials').should.eql 'magicland/partials'
end
end

describe '#partial()'
before_each
set('views', 'spec/fixtures')
set('partials', 'spec/fixtures/partials')
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

it 'should render collections with a given object name'
get('/', function(){
return this.partial('video.haml.html', {
collection: ['im a movie', 'im another movie'],
as: 'vid'
})
})
get('/').body.should.include '<li>im a movie'
get('/').body.should.include '<li>im another movie'
end
end
end

describe '#render()'
before_each
set('views', 'spec/fixtures')
end

describe 'given a callback'
it 'should be passed the rendered content'
get('/', function(){
this.render('hello.haml.html', {}, function(err, content){
if (err) this.error(err)
else this.halt(203, content)
})
})
get('/').body.should.include '<html><body>'
get('/').status.should.eql 203
