
describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
compileCookie = require('express/plugins/cookie').compileCookie
parseCookie = require('express/plugins/cookie').parseCookie
end

describe 'Cookie'
describe 'compileCookie()'
it 'should return a cookie string'
var options = {
path: '/',
domain: '.vision-media.ca'
}
compileCookie('foo', 'bar', options).should.eql 'foo=bar; path=/; domain=.vision-media.ca'
end

it 'should correctly format any Date objects'
var options = {
expires: new Date(Date.parse('May 25, 1987 11:13:00 PDT')),
path: '/foo',
domain: '.vision-media.ca'
}
compileCookie('foo', 'bar', options).should.eql 'foo=bar; expires=Mon, 25 May 1987 18:13:00 GMT; path=/foo; domain=.vision-media.ca'
end

it 'should convert true to a key without a value'
var options = {
path: '/',
secure: true,
httpOnly: true
}
compileCookie('foo', 'bar', options).should.eql 'foo=bar; path=/; secure; httpOnly'
end

it 'should compile without options'
compileCookie('foo', 'bar').should.eql 'foo=bar'
end
end

describe 'parseCookie()'
it 'should parse cookie key/value pairs'
var attrs = 'sid=1232431234234; data=foo'
parseCookie(attrs).should.eql { sid: '1232431234234', data: 'foo' }
end

it 'should preserve case'
var attrs = 'SID=1232431234234; Data=foo'
parseCookie(attrs).should.eql { SID: '1232431234234', Data: 'foo' }
end

it 'should disregard ad-hoc invalid whitespace'
var attrs = ' SID     =  1232431234234 ;  data =  foo'
parseCookie(attrs).should.eql { SID: '1232431234234', data: 'foo' }
end

it 'should support complex quoted values'
var attrs = 'SID="123456789"; fbs_0011223355="uid=0987654321&name=Test+User"'
parseCookie(attrs).should.eql { SID: '123456789', fbs_0011223355: 'uid=0987654321&name=Test User' }
end
