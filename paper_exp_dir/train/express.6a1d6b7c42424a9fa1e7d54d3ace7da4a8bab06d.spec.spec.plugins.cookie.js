
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

it 'should currectly format any Date objects'
var data = {
expires: new Date
}
print(new Date('October 13, 1975 11:13:00'))
compileCookie(data).should.eql 'expires='
end
end

