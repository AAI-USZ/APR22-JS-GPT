
describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
end

describe 'Cookie'
describe 'compileCookie()'
it 'should return a cookie string'
var data = {
path: '/',
domain: '.vision-media.ca'
}
compileCookie(data).should.eql 'path=/; domain=.vision-media.ca'
end
end

