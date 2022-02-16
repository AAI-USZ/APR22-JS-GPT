
CSSColors = Plugin.extend({
on: {
response: function(event) {
if (event.response.headers['content-type'] == mime('css'))
event.response.body = event.response.body.replace('black', '#000')
}
}
})

describe 'Express'
describe 'use()'
before_each
reset()
use(CSSColors)
end

describe 'Event'
describe '#init()'
it 'should accept arbitrary data'
var event = new Event('foo', { bar: 'baz' })
event.bar.should.eql 'baz'
end
end
end

describe 'events'
describe 'response'
