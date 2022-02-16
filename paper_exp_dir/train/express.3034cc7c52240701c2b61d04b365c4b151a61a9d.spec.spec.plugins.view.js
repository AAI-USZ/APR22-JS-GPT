
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

describe '#render()'
before_each
set('views', 'spec/fixtures')
end

describe 'given a valid view name'
describe 'and layout of the same type exists'
it 'should render the layout and view'
get('/', function(){
this.render('hello.haml.html')
})
get('/').body.should.include '<html><body>'
get('/').body.should.include '<h2>Hello'
end

it 'should default context to the current request'
get('/', function(){
this.title = 'Welcome'
this.render('page.haml.html', { layout: false })
})
get('/').body.should.include '<title>Welcome'
end
end

describe 'and layout of the same type does not exist'
