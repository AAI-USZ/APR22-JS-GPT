
var utils = require('../lib/utils')
, assert = require('assert');

describe('utils.etag(body, encoding)', function(){
it('should support strings', function(){
utils.etag('express!')
.should.eql('"zZdv4imtWD49AHEviejT6A=="')
})

it('should support utf8 strings', function(){
utils.etag('express❤', 'utf8')
.should.eql('"fsFba4IxwQS6h6Umb+FNxw=="')
})

it('should support buffer', function(){
var buf = new Buffer('express!')
utils.etag(buf)
.should.eql('"zZdv4imtWD49AHEviejT6A=="');
})

it('should support empty string', function(){
utils.etag('')
.should.eql('"1B2M2Y8AsgTpgAmY7PhCfg=="');
})
})

describe('utils.wetag(body, encoding)', function(){
it('should support strings', function(){
utils.wetag('express!')
})

it('should support utf8 strings', function(){
utils.wetag('express❤', 'utf8')
})

it('should support buffer', function(){
var buf = new Buffer('express!')
utils.wetag(buf)
