
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
