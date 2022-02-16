
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
expires: new Date('May 25, 1987 11:13:00')
}
compileCookie(data).should.eql 'expires=Mon, 25-May-1987 11:13:00 GMT'
end
end

describe 'parseCookie()'
it 'should parse cookie key/value pairs'
var attrs = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; domain=.example.net'
var expected = {
expires: 'Fri, 31-Dec-2010 23:59:59 GMT',
path: '/',
