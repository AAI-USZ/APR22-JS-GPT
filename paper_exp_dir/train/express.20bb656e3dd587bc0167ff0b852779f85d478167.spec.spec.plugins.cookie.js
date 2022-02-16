
describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
end

describe 'Cookie'
describe 'parse()'
it 'should parse cookie key/value pairs'
var attrs = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; domain=.example.net'
var expected = {
expires: 'Fri, 31-Dec-2010 23:59:59 GMT',
path: '/',
domain: '.example.net'
