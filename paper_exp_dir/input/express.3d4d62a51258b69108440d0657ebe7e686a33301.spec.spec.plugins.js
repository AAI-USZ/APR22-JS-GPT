
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

