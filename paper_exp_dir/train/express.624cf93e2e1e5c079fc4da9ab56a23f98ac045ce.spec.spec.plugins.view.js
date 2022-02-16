
ejs = require('ejs')

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

describe 'ejs'
it 'should work without options'
var str = '<h2><%= "Title" %></h2>'
ejs.render(str).should.eql '<h2>Title</h2>'
end

it 'should work with locals'
var str = '<h2><%= title %></h2>'
ejs.render(str, { locals: { title: 'Title' }}).should.eql '<h2>Title</h2>'
end
end

describe '#partial()'
before_each
set('views', 'spec/fixtures')
set('partials', 'spec/fixtures/partials')
end

describe 'given a valid view name'
describe 'with EJS'
it 'should render a partial'
get('/', function(){
this.render('list.html.ejs', { locals: { items: ['foo', 'bar'] }})
})
get('/').body.should.include '<ul>'
get('/').body.should.include '<li>foo'
get('/').body.should.include '<li>bar'
end

