
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
var data = {
path: '/',
domain: '.vision-media.ca'
}
compileCookie(data).should.eql 'path=/; domain=.vision-media.ca'
end

it 'should currectly format any Date objects'
var data = {
expires: new Date('May 25, 1987 11:13:00'),
path: '/foo',
domain: '.vision-media.ca'
}
compileCookie(data).should.eql 'expires=Mon, 25-May-1987 11:13:00 GMT; path=/foo; domain=.vision-media.ca'
end

it 'should convert true to a key without a value'
var data = {
path: '/',
